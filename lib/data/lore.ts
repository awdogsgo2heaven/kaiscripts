'use strict';
import * as consts from '../config/constants';
import * as KaiScripts from '../kai-scripts';
import KaiScript from '../kai-scripts/kai-script';
import * as pg from 'pg-promise';
import db from './index';

const sqlGetLore = new pg.QueryFile('../lib/data/sql/getLore.sql', {
  compress: true
});

export interface ILoreSql {
  id: number
  version: number,
  key: string,
  text: string
}

export class Lore {
  constructor(public data: ILoreSql) {

  }

  get id() {
    return this.data.id;
  }

  get text() {
    return this.data.text;
  }

  static async get(key: string) {
    var data = await db().oneOrNone(sqlGetLore, { key: key }) as ILoreSql;
    if (data) {
      return new Lore(data)
    }
    else {
      return null;
    }
  }
}
