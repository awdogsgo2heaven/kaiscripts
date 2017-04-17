'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import {BadRequestError, NotFoundError} from '../errors';
import LocatorWeatherComponent from './locator-weather-component';
import LocatorDiscoverComponent from './locator-discover-component';
import LocatorGeoComponent from './locator-geo-component';
import {Account, ILocationSql} from '../data/account';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {WeatherCache, IWeatherInfo} from '../data/weather-cache';
import {Tile, IRegionInfo, IDistanceNode} from '../data/tile';
import * as SocketIO from 'socket.io';
import {ICoord, ITile} from '../helpers/common';
import * as BlueBird from 'bluebird';
import * as Collections from 'typescript-collections';
import * as bases from '../kai-scripts';
import {KaiScriptFactory} from '../factories/kai-script';

export type LocationServiceOptions = {
  user: Account
}

export interface IStepResult {
  query: ILocationSql,
  kaiScript: AvatarKaiScript
}

export type LocationSearchResult = {
  name: string,
  lore: string
}

export class LocatorService {

  public user: Account
  private _weather: LocatorWeatherComponent
  private _discover: LocatorDiscoverComponent
  private _geo: LocatorGeoComponent

  constructor(public options: LocationServiceOptions, public socket: SocketIO.Server) {
    this.user = options.user;
    this._weather = new LocatorWeatherComponent(this.user);
    this._discover = new LocatorDiscoverComponent(this.user);
    this._geo = new LocatorGeoComponent(this.user);
  }

  findResults(discoveries, callback) {
    //var sample = _.sample
  }

  postgresCoord(coord: ICoord): number[] {
    return [coord.lon, coord.lat]
  }

  objectCoord(coord: number[]): ICoord {
    return { lat: coord[1], lon: coord[0], createdAt: 0 };
  }

  isWithinHomePoint(location: ICoord) {
    if (this.user.homePoint) {
      const trueDistance = distance(location, this.objectCoord(this.user.homePoint));
      if (trueDistance < 10) {
        return true;
      }
    }
    return false;
  }

  //check for unrealistic jumps in player distance for cheating
  isWalking(lastKnownLocation: ICoord, newLocation: ICoord) {
    if (lastKnownLocation) {

      const trueDistance = distance(newLocation, lastKnownLocation);
      const hoursBetweenLocations = Math.abs((lastKnownLocation.createdAt - Date.now()) * consts.MILLI_TO_HOURS);
      const speed = trueDistance / hoursBetweenLocations;

      //if speed greater than 500 we got cheaters
      if (speed < consts.MAX_WALK_SPEED) {
        return true;
      }
    }

    return false;
  }
  //check for unrealistic jumps in player distance for cheating
  isCheating(lastKnownLocation: ICoord, newLocation: ICoord) {
    if (lastKnownLocation) {

      const trueDistance = distance(newLocation, lastKnownLocation);
      const hoursBetweenLocations = Math.abs((lastKnownLocation.createdAt - Date.now()) * consts.MILLI_TO_HOURS);
      const speed = trueDistance / hoursBetweenLocations;

      //if speed greater than 500 we got cheaters
      if (speed > consts.CHEATER_SPEED) {
        return true;
      }
    }

    return false;
  }

  async findRegion(coords: ICoord): Promise<IRegionInfo> {
    return await this._geo.findRegion(coords);
  }

  async searchDiscoveries(location: ILocationSql, discoveryType: string = 'item') {
    return await this._discover.find(location);
  }

  //append location to account
  async appendLocation(location: ICoord) {

    const lastKnownLocation = await this.user.getLastKnownLocation();

    const isCheating = this.isCheating(lastKnownLocation, location);
    const isWithinHomePoint = this.isWithinHomePoint(location);
    if (isCheating) {
      await this.user.incCheaterScore();
    }
    if (isWithinHomePoint) {
      const isReady = await this.user.isHomePointReady();

      if (isReady) {
        await this.user.visitHomePoint();
        console.log('Healing from Homepoint');
        this.socket.in(this.user.avatar.id.toString()).emit('MESSAGE', 'All KaiScripts have been restored');
      }
    }
    else {
      if (this.user.surviving === 0) {
        throw new BadRequestError('Need at least one healthy KaiScript to explore with')
      }
    }

    await this.user.updateLocation(location);

    return location;
  }

  async update(coord: ITile) {
    return this._geo.updateUserMap(coord);
  }

  async updateTest(coord: ITile) {
    return this._geo.updateTest(coord);
  }

  async query(coords: ICoord) : Promise<ILocationSql> {
    const query = this._geo.transCoordToTile(coords);
    const tile = await this._geo.getTile(query);

    //limitation: we are only checking the current tile and not surrounding tiles, item could be near edge
    var feature = await tile.findFeatures(coords);

    var region = tile.region;

    if (region == null) {
      region = await this.findRegion(coords);
      tile.setRegion(region);
    }

    var weather = await WeatherCache.find(region.city);

    if (weather == null) {
      weather = await this._weather.find(coords);
      WeatherCache.cache(region.city, weather);
    }

    var time = this._geo.findTime(coords);

    var discoveryQuery = {
      coordinates: coords,
      features: feature || null,
      region: region,
      weather: weather,
      time: time,
      createdAt: Date.now()
    } as ILocationSql;

    return discoveryQuery;


  }

  async step(coords: ICoord): Promise<IStepResult> {
    const lastKnownLocation = await this.user.getLastKnownLocation();

    await this.appendLocation(coords);
    const isWalking = this.isWalking(lastKnownLocation, coords);
    if (true) {
      var test = await this.user.incTravelDistance(distance(lastKnownLocation, coords));
      const feetTraveled = await this.user.getTravelDistance();

      const goal = await this.user.getTravelGoal();

      const finalGoal = goal + consts.MIN_TRAVEL_FEET_REQUIRED;

      if (feetTraveled >= finalGoal) {

        await this.user.resetTravelGoal();
        await this.user.resetTravelDistance();

        const query = await this.query(coords);
        // var discovery = await this.searchDiscoveries(query, 'kaiScript');
        const kaiScript = _.sample(bases); //discovery.kaiScript;

        if (kaiScript) {
          return {
            kaiScript: await KaiScriptFactory.generate(kaiScript),
            query: query
          }
        }
      }

    }
    else {
      await this.user.resetTravelDistance();
      await this.user.resetTravelGoal();
    }
  }

  async claimItem(coords: ICoord) {

    function serialize(discovery): LocationSearchResult {
      return {
        name: discovery.name,
        lore: discovery.desc
      };
    }

    const transTile = this._geo.transCoordToTile(coords);
    const tile = await this._geo.getTile(transTile);
    const query = await this.query(coords);

    const isRemoved = await tile.removeItem(this.user.avatar.id, coords);

    if (isRemoved) {
      var discovery = await this.searchDiscoveries(query);

      const item = await discovery.item;
      if (item) {
        try {
          await this.user.avatar.addItem(item);
        } catch (e) {

          const query = this._geo.transCoordToTile(coords);
          const tile = await this._geo.getTile(query);
          await tile.addItem(this.user.avatar.id, coords);

          throw e;
        }
        return serialize(item);
      }
    }
    else {
      throw new BadRequestError('Nothing to take.');
    }
  }
}
//calculate distance between two points
export function distance(coord1: ICoord, coord2: ICoord): number {
  var R = 3963.2; // miles
  var dLat = (coord2.lat - coord1.lat) * Math.PI / 180.0;
  var dLon = (coord2.lon - coord1.lon) * Math.PI / 180.0;
  var lat1 = coord1.lat * Math.PI / 180.0;
  var lat2 = coord2.lat * Math.PI / 180.0;

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}
