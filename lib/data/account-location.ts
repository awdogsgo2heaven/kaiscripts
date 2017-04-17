'use strict';
import * as consts from '../config/constants';
import * as KaiScripts from '../kai-scripts';
import KaiScript from '../kai-scripts/kai-script';
import * as pg from 'pg-promise';
import db from './index';
import {IGeoJSON} from '../helpers/common';

export interface IAccountLocationList {
  rows: AccountLocation[]
  count: number
}

export interface IAccountLocationSql {
  name: string
  truCoord: string,
  virtuCoord: string,
  keywords: string[]
  temp: number
  humidty: number
  timeOfDay: string
  weather: string
  createdAt: number
}

export class AccountLocation {
  constructor(public data: IAccountLocationSql) {

  }

  get truCoord(): number[] {
    var geoJSON = JSON.parse(this.data.truCoord) as IGeoJSON;
    return geoJSON.coordinates;
  }

  get virtuCoord(): number[] {
    var geoJSON = JSON.parse(this.data.truCoord) as IGeoJSON;
    return geoJSON.coordinates;
  }

  get keywords() {
    return this.data.keywords;
  }

  get humidty() {
    return this.data.humidty;
  }

  get temp() {
    return this.data.temp;
  }

  get timeOfDay() {
    return this.data.timeOfDay;
  }

  get weather() {
    return this.data.weather;
  }

  get createdAt() {
    return this.data.createdAt;
  }

}
