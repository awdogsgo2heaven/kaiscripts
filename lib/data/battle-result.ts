'use strict';
import * as consts from '../config/constants';
import * as KaiScripts from '../kai-scripts';
import KaiScript from '../kai-scripts/kai-script';
import * as pg from 'pg-promise';
import db from './index';
import {IBattleEventCache} from './battle-event';

const sqlFindBattleResultById = new pg.QueryFile('../lib/data/sql/getBattleEventResult.sql', {
  compress: true
});

const sqlAcceptBattleResult = new pg.QueryFile('../lib/data/sql/updateBattleEventResult.sql', {
  compress: true
});

export interface IBattleResultSql {
  id?: number
  coins: number
  status: string
  time: number
  totalDamage: number
  BattleEventId: number
  AvatarId: number
  isInfected: boolean
  points: number
  cache?: IBattleEventCache
  isEventComplete?: boolean 
  isAccepted?: boolean
}

export class BattleResult {
  constructor(public data: IBattleResultSql) {

  }

  get id() {
    return this.data.id;
  }

  get coins() {
    return this.data.coins;
  }

  get isWinner() {
    return this.data.status === 'win';
  }

  get status() {
    return this.data.status;
  }

  get time() {
    return this.data.time;
  }

  get totalDamage() {
    return this.data.totalDamage;
  }

  get cache(): IBattleEventCache {
    return this.data.cache;
  }

  get isInfected() {
    return this.data.isInfected;
  }

  get isAccepted() {
    return this.data.isAccepted;
  }

  get isEventComplete() {
    return this.data.isEventComplete;
  }

  get BattleEventId() {
    return this.data.BattleEventId;
  }

  static findById(id: number, avatarId: number) {
    return db().oneOrNone(sqlFindBattleResultById, { id: id, avatarId: avatarId }).then((x: IBattleResultSql) => new BattleResult(x || <any>{}));
  }

  static accept(id: number, avatarId: number) {
    return db().none(sqlAcceptBattleResult, { id: id, avatarId: avatarId });
  }
  // update() {
  //   return db().none(, {
  //     coins: this.coins,
  //     status: this.status,
  //     techs: this.techs,
  //     eventId: this.BattleEventId,
  //     avatarId: this.data.AvatarId
  //   })


}
