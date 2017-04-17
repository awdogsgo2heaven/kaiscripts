import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as Util from "../helpers";
import * as redis from './redis';
import {ITile, ICoord} from '../helpers/common';
import * as BlueBird from 'bluebird';
import * as Collections from 'typescript-collections';
import * as turf from 'turf';

export type IGeoFeatures = {
  [key: string]: GeoJSON.FeatureCollection<any>;
}

export interface IRegionInfo {
  region: string,
  country: string,
  city: string,
  cityId: string
}

export interface IGeoExtendedFeatures {
  items: Array<number[]>
}

export interface ITileSerialize {
  features: (IGeoExtendedFeatures | IGeoFeatures),
  region: IRegionInfo
}

export interface IDistanceNode {
  distance: number,
  category: string,
  feature: GeoJSON.Feature<GeoJSON.GeometryObject>
}

export class Tile {

  public constructor(public index: ITile, public features: (IGeoExtendedFeatures | IGeoFeatures), public region: IRegionInfo) {

  }

  get id() {
    return this.index.x * this.index.y;
  }

  async findRandomPoints(filter: string[]): Promise<Array<number[]>> {
    var points = [];
    for (const key of filter) {
      const collection = this.features[key];
      if (collection) {
        await BlueBird.each(collection.features, (feature: GeoJSON.Feature<GeoJSON.Polygon>) => {
          var geometry = feature.geometry as GeoJSON.Polygon;
          if (geometry) {
            if (geometry.type == 'Polygon' || geometry.type == 'MultiPolygon') {
              var point = Util.randGeoPoint(feature);
              points.push(point.geometry.coordinates);
            }
          }
        })
      }
    }
    return points;
  }

  async cache(force: boolean = false) {
    var result = await redis.client.send('exists', [this.id.toString()]);
    if (result == 0 || force) {
      await redis.client.set(this.id.toString(), JSON.stringify({ region: this.region, features: this.features }));
    }
    return redis.client.send('expire', [this.id.toString(), '300']);
  }

  async setRegion(region: IRegionInfo) {
    this.region = region;
    return this.cache(true);
  }

  async getAvatarItems(avatarId: number): Promise<Array<number[]>> {
    const key = redis.key(this.id, avatarId);
    const points = await redis.client.get(key);
    if (points) {
      return JSON.parse(points);
    }
    return null;
  }

  async addItem(avatarId: number, coords: ICoord) {
    var itemPoints = await this.getAvatarItems(avatarId);

    const point = itemPoints.push([coords.lon, coords.lat]);
    //remove item from tile
    this.setAvatarItems(avatarId, itemPoints);
    return true;

  }

  async removeItem(avatarId: number, coords: ICoord) {
    var itemPoints = await this.getAvatarItems(avatarId);
    var index = _.findIndex(itemPoints, (point: number[]) => {
      return point[1] == coords.lat && point[0] == coords.lon
    });

    if (index > -1) {
      const point = itemPoints.splice(index, 1)[0];
      //remove item from tile
      this.setAvatarItems(avatarId, itemPoints);
      return true;
    }
    return false;
  }
  async setAvatarItems(avatarId: number, points: Array<number[]>) {
    const key = redis.key(this.id, avatarId);
    await redis.client.set(key, JSON.stringify(points));
    return redis.client.send('expire', [key, '3600']);
  }

  async findFeatures(coord: ICoord) {
    const keys = [];
    for (const key of ['landuse', 'places', 'pois', 'water']) {
      const collection = this.features[key];

      if (collection) {
        if (collection.features.length > 0) {
          keys.push(key);
        }
        await BlueBird.each(collection.features, (feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
          if (feature.properties) {
            if (feature.properties.kind) {
              keys.push(feature.properties.kind);
            }
          }
        })
      }
    }
    return keys;
  }
  async findNearestFeature(coord: ICoord) {
    const point = turf.point([coord.lon, coord.lat]);

    const tree = new Collections.BSTree<IDistanceNode>((A: IDistanceNode, B: IDistanceNode) => {
      if (A.distance === B.distance) {
        return 0;
      }
      else if (A.distance < B.distance) {
        return 1;
      }
      return -1;
    });

    for (const key of ['landuse', 'places', 'pois', 'water']) {
      const collection = this.features[key];

      if (collection) {
        await BlueBird.each(collection.features, (feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
          const distance = Util.distance(point, feature);
          tree.add({
            distance: distance,
            category: key,
            feature: feature
          });
        })
      }
    }

    return tree.minimum();
  }

  static async find(tile: ITile) {
    const id = tile.x * tile.y;
    const data = await redis.client.get(id.toString());
    if (data) {
      const result = JSON.parse(data || '{}') as ITileSerialize;
      return new Tile(tile, result.features, result.region);
    }
    return null;
  }

}
