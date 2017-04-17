'use strict';
import * as consts from '../config/constants';
import * as KaiScripts from '../kai-scripts';
import KaiScript from '../kai-scripts/kai-script';
import * as pg from 'pg-promise';
import db from './index';
import {IBattleEventCache} from './battle-event';
import {Tile, IRegionInfo, IDistanceNode} from '../data/tile';

const sqlUpdateFactionStatistic = new pg.QueryFile('../lib/data/sql/updateFactionStatistic.sql', {
  compress: true
});

const sqlGetFactionStatistic = new pg.QueryFile('../lib/data/sql/getFactionStatistic.sql', {
  compress: true
});

export interface IFactionStatisticSql {
  id?: number
  points: number
  faction: string
  cityId: string
  city: string
  region: string
  regionPoints?: number
}

export interface IFactionStatisticTotalSql {
  faction: string
  city: string
  cityPoints: number
  region: string
  regionPoints: number
}


export interface IFactionStats {
  red: IFactionStatisticTotalSql,
  blue: IFactionStatisticTotalSql
}


export class FactionStatistic {
  constructor(public data: IFactionStatisticSql) {

  }

  get id() {
    return this.data.id;
  }

  get points() {
    return this.data.points;
  }

  get cityId() {
    return this.data.cityId;
  }

  get city() {
    return this.data.city;
  }

  get region() {
    return this.data.region;
  }

  get faction() {
    return this.data.faction;
  }

  

  static addPoints(statistic: IFactionStatisticSql) {
    return db().one(sqlUpdateFactionStatistic, statistic).then((x: IFactionStatisticSql) => new FactionStatistic(x || <any>{}));
  }

  static async getFactionControl(region: IRegionInfo): Promise<string> {
    var statistic = await this.getByRegion(region);
    if (statistic.blue.regionPoints > statistic.red.regionPoints) {
      return statistic.blue.faction;
    }
    else if (statistic.red.regionPoints > statistic.blue.regionPoints) {
      return statistic.red.faction; 
    }
    else {
      return '';      
    }
  }

  static async getByRegion(region: IRegionInfo): Promise<IFactionStats> {
      const results = await db().manyOrNone(sqlGetFactionStatistic, {cityId: region.cityId}) as IFactionStatisticTotalSql[];
      const redFaction = results.find(x => x.faction === consts.FACTIONS.RED) || {} as IFactionStatisticTotalSql;
      const blueFaction = results.find(x => x.faction === consts.FACTIONS.BLUE) || {} as IFactionStatisticTotalSql;

      return {
          red: {
            faction: consts.FACTIONS.RED,
            city: redFaction.city || region.city,
            cityPoints: redFaction.cityPoints || 0,
            region: redFaction.region || region.region,
            regionPoints: redFaction.regionPoints || 0            
          },
          blue: {
            faction: consts.FACTIONS.BLUE,
            city: blueFaction.city || region.city,
            cityPoints: blueFaction.cityPoints || 0,
            region: blueFaction.region || region.region,
            regionPoints: blueFaction.regionPoints || 0              
          }
      };
    }

}
