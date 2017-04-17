'use strict';

import LocatorComponent from './locator-component';
import * as SunCalc from 'suncalc';
import * as _ from 'underscore';
import {BadRequestError} from '../errors';
import * as request from 'request';
import {ICoord, ITile} from '../helpers/common';
import {GeoDiscovery} from '../data/geo-discovery';
import {Tile, IGeoFeatures, IGeoExtendedFeatures, IRegionInfo} from '../data/tile';
import {sprintf} from 'sprintf-js';
import {geoname} from '../data';
import * as pg from 'pg-promise';
import * as Util from '../helpers';
import * as BlueBird from 'bluebird';
import * as Collections from 'typescript-collections';

const sqlFindNearestRegion = new pg.QueryFile('../lib/data/sql/findNearestRegion.sql', {
  compress: true
});

export default class LocatorGeoComponent extends LocatorComponent {

  transCoordToTile(coord: ICoord) {
    const zoom = 18;

    var tileX = Util.long2tile(coord.lon, zoom);
    var tileY = Util.lat2tile(coord.lat, zoom);

    return {
      x: tileX,
      y: tileY,
      createdAt: coord.createdAt
    }
  }
  async getTile(query: ITile): Promise<Tile> {
    var tile: Tile;
    tile = await Tile.find(query);


    console.log(tile);
    if (true) {
      var requestUrl = sprintf('%s/18/%f/%f.json?api_key=%s',
        'https://tile.mapzen.com/mapzen/vector/v1/all', query.x,
        query.y, process.env.MAPZEN_API_KEY);

      const mapData = await new Promise<IGeoFeatures>(function (resolve, reject) {
        console.log(requestUrl);
        request.get({
          url: requestUrl,
          json: true
        }, (err, res, body) => {
          if (err == null && body && res.statusCode === 200) {
            resolve(body);
          }
          else {
            console.log(body);
            reject(new BadRequestError('Unable to update map'));
          }
        });
      });
      tile = new Tile(query, mapData, null);
    }
    else {
    }
    return tile;
  }

  async updateUserMap(query: ITile) {
    var tile = await this.getTile(query);

    var itemPoints: Array<number[]>

    itemPoints = await tile.getAvatarItems(this.user.avatar.id);

    if (itemPoints == null) {
      itemPoints = await tile.findRandomPoints(['earth']);
      await tile.setAvatarItems(this.user.avatar.id, itemPoints);
    }

    await tile.cache();

    tile.features['items'] = itemPoints;

    return tile.features;
  }

  async updateTest(query: ITile) {
    var tile = await this.getTile(this.transCoordToTile({ lat: query.y, lon: query.x, createdAt: Date.now() }));

    var itemPoints: Array<number[]>

    itemPoints = await tile.getAvatarItems(this.user.avatar.id);

    if (itemPoints == null) {
      itemPoints = await tile.findRandomPoints(['earth']);
      await tile.setAvatarItems(this.user.avatar.id, itemPoints);
    }

    await tile.cache();

    tile.features['items'] = itemPoints;

    
    return tile;
    }
  

  async findItem(coords: ICoord) {

    return false;
  }

  findRegion(coord: ICoord): Promise<IRegionInfo> {
    return geoname.oneOrNone(sqlFindNearestRegion, { lon: coord.lon, lat: coord.lat }).then(function(data: IRegionInfo) {
      if (data) {
        return { region: data.region, country: data.country, city: data.city, cityId: data.cityId };
      }
      else {
        return null;
      }
    })
  };


  findTime(coord: ICoord): string {
    //get current time for user *note need to consider user location*
    var current = new Date().getTime();
    var times = SunCalc.getTimes(new Date(), coord.lat, coord.lon);

    var sunrise = times.sunrise.getTime();
    var solarNoon = times.solarNoon.getTime();
    var eveningGoldenHour = times.goldenHour.getTime();
    var night = times.night.getTime();

    if (current >= sunrise && current < solarNoon) {
      return 'day';
    } else if (current >= solarNoon && current < eveningGoldenHour) {
      return 'day';
    } else if (current >= eveningGoldenHour && current < night) {
      return 'dark';
    }
    return 'dark';
  };

}
