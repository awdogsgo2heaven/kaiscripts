'use strict';
import * as consts from '../config/constants';
import * as KaiScripts from '../kai-scripts';
import KaiScript from '../kai-scripts/kai-script';
import * as pg from 'pg-promise';
import db from './index';
import {ITile, ICoord} from '../helpers/common';
import * as redis from './redis';
import * as Util from "../helpers";

const sqlGetCache = new pg.QueryFile('../lib/data/sql/getWeatherCache.sql', {
  compress: true
});

export interface IWeatherInfo {
  humidty: number,
  weather: string,
  temp: number
}

export class WeatherCache {

  static async cache(city: string, info: IWeatherInfo) {
    const key = redis.key('weather', city);
    await redis.client.set(key, JSON.stringify(info));
    return redis.client.send('expire', [key, '3600']);
  }

  static async find(city: string): Promise<IWeatherInfo> {
    const key = redis.key('weather', city);
    var data = await redis.client.get(key);
    if (data) {
      return JSON.parse(data) as IWeatherInfo;
    }
    else {
      return null;
    }
  }
}
