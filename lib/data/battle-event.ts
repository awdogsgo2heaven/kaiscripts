'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as Util from "../helpers";
import Attack from '../attacks/attack';
import Trait from '../traits/trait';
import base from '../kai-scripts/kai-script';
import Status from '../statuses/status';
import * as bases from '../kai-scripts';
import * as Traits from '../traits';
import {ValidationError, NotFoundError, BadRequestError} from '../errors';
import * as Attacks from '../attacks';
import * as BlueBird from 'bluebird';
import {AvatarItem, IAvatarItemSql} from './avatar-item';
import {Avatar, IAvatarSql} from './avatar';
import {AvatarKaiScript, IAvatarKaiScriptSql} from './avatar-kai-script';
import {AccountLocation, IAccountLocationSql} from './account-location';
import {ILocationSql} from './account';

import {BattleResult, IBattleResultSql} from './battle-result';
import PlayerScore from '../objects/player-score';

import * as pg from 'pg-promise';
import db from './index';

export interface PlayerFinalState {
  type: string,
  outcome: string,
  isInfected: boolean,
  score: PlayerScore
}

const sqlCreateRandomBattleEvent = new pg.QueryFile('../lib/data/sql/createRandomBattleEvent.sql', {
  compress: true
});

const sqlUpdateBattleResults = new pg.QueryFile('../lib/data/sql/createBattleResult.sql', {
  compress: true
});

export class BattleEvent {

  public winner: string
  constructor(public data: IBattleEventSql) {

  }

  get id(): number {
    return this.data.id
  }

  get cache(): IBattleEventCache {
    return this.data.cache;
  }

  get matchType(): string {
    return this.data.matchType;
  }

  getPlayer(type: string): IPlayerCache {
    var winner = this.cache[type];
    return winner;
  }

  tally(player1: BattleResult, player2: BattleResult, isDisconnect: boolean) {

    return db().func('"FinishBattle"', [
      this.id,
      this.cache,
      player1.data.AvatarId,
      player1.coins,
      player1.status,
      player1.data.time,
      player1.totalDamage,
      player1.isInfected,
      player1.data.points,
      player2.data.AvatarId,
      player2.coins,
      player2.status,
      player2.data.time,
      player2.totalDamage,
      player2.isInfected,
      player2.data.points,
      this.matchType
    ]);
  }

  static getResult(avatarId: number, id: number): Promise<BattleResult> {
    return BattleResult.findById(id, avatarId).then(function(event: BattleResult) {
      if (event.id) {
        return event;
      }
      else {
        throw new NotFoundError();
      }
    })
  }


  static async createRandomEvent(avatar: Avatar, opponent: AvatarKaiScript, query: ILocationSql) {

    const player = await BlueBird.props({
      type: 'defender',
      avatar: avatar.data,
      kaiScripts: avatar.findRawTeam(),
      battleCache: avatar.findCache(),
      antiViralCount: avatar.getDuplicateCount(opponent.base.virus.antidote.toSymbol())
    }) as IPlayerCache;

    //check that not every KaiScript is out of health
    if(player.kaiScripts.every(x => x.health === 0)) {
      return null;
    }

    const enemy = {
      type: 'invader',
      avatar: {
        id: -1
      },
      kaiScripts: [opponent.data],
      battleCache: null,
      antiViralCount: 0
    } as IPlayerCache;

    //new event
    //cache/freeze state of player
    var event = new BattleEvent({
      matchType: 'wild',
      cache: {
        players: [player, enemy],
        location: query
      }
    });

    var id = await db().one(sqlCreateRandomBattleEvent, {
      cache: event.data.cache,
      avatarId: avatar.id
    }) as { BattleEventId: number };

    event.data.id = id.BattleEventId;

    return event;
  }
}

export interface IPlayerCache {
  type: string,
  avatar?: IAvatarSql,
  kaiScripts: IAvatarKaiScriptSql[]
  battleCache: IAvatarItemSql[]
  antiViralCount: number
}

export interface IBattleEventCache {
  players: IPlayerCache[]
  location: ILocationSql
}

export interface IBattleEventSql {
  id?: number
  matchType: string
  cache: IBattleEventCache
}
