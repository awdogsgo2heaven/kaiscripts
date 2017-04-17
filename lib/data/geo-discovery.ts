'use strict';
import * as consts from '../config/constants';
import * as KaiScripts from '../kai-scripts';
import * as Items from '../items';
import KaiScript from '../kai-scripts/kai-script';
import Item from '../items/item';
import {ICoord} from '../helpers/common';
import * as pg from 'pg-promise';
import db from './index';
import {ValidationError, NotFoundError, BadRequestError} from '../errors';

const sqlFindGeoDiscoveryByKeys = new pg.QueryFile('../lib/data/sql/findGeoDiscoveryByKeys.sql', {
  compress: true
});

const sqlFindGeoDiscoveryByCoordinates = new pg.QueryFile('../lib/data/sql/findGeoDiscoveryByCoordinates.sql', {
  compress: true
});

var chances = {
  'common': 100,
  'uncommon': 50,
  'rare': 10,
  'very rare': 1
}
export class GeoDiscovery {
  constructor(public data: IGeoDiscoverySql) {

  }

  get id(): number {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get symbol(): string {
    return this.data.discovery;
  }

  get weight(): any {
    return chances[this.data.chance] / 100.0;
  }

  get KaiScript() {
    return KaiScripts[this.data.discovery] || null;
  }

  get Item() {
    return Items[this.data.discovery] || null;
  }

  get kaiScript(): typeof KaiScript {
    return this.KaiScript;
  }

  get item(): typeof Item {
    return this.Item;
  }

  /** Find GeoDiscoveries using Keys */
  static findByQuery(query: IGeoDiscoveryQuery): Promise<GeoDiscovery[]> {
    return db().manyOrNone(sqlFindGeoDiscoveryByKeys, query).then((data: IGeoDiscoverySql[]) => {
      if (data) {
        return data.map((x) => new GeoDiscovery(x));
      }
      else {
        return [];
      }
    })
  }
}

export interface IGeoDiscoverySql {
  id: number
  name: string
  discovery: string
  chance: string
}

export interface IGeoDiscoveryQuery {
  weather: string,
  timeOfDay: string,
  season: string,
  category: string,
  key: string,
  region: string,
  country: string,
  temp: number,
  discoveryType: string
}
