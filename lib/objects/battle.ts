'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import Player from './player';
import * as SocketIO from 'socket.io';
import Attack from '../attacks/attack';
import {BattleEvent, PlayerFinalState} from '../data/battle-event';
import PlayerState from './player-state';
import * as async from 'async';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {Account} from '../data/account';
import {logger} from '../helpers/logger';
import * as events from 'events';
import * as Collections from 'typescript-collections';
import {BattleResult} from '../data/battle-result';

export type BattleOptions = {
  event: BattleEvent
  publisher: events.EventEmitter
}

export class Battle {

  public isActive: boolean = true
  public event: BattleEvent
  public serviceNotifier: events.EventEmitter
  public player: {
    one?: Player,
    two?: Player
  }
  public pingInterval: number = null;
  public forceSwapTimeout: number = null;
  public tickBandwidthInterval: number = null;
  public battleTimeout: number = null;
  public history: IHistoryEvent[] = [];
  public speedCheckTimeout: number = null;
  public isSaving: boolean = false;
  public invitees: Collections.Set<number> = new Collections.Set<number>();

  constructor(public options: BattleOptions, public io: SocketIO.Server) {
    this.event = options.event;
    this.serviceNotifier = options.publisher;
    this.player = {
      one: null,
      two: null
    };

  }

  isFull(): boolean {
    return !(this.player.one == null || this.player.two == null)
  }

  isInvited(user: Account) {
    return this.invitees.contains(user.id);
  }

  error(error) {
    logger.error(error);
    var self = this;
    return this.saveFinalState(
      new BattleResult(
        {
          status: 'disconnect',
          coins: 0,
          AvatarId: this.player.one.avatar.id,
          time: this.player.one.state.score.getTime(),
          totalDamage: this.player.one.state.score.damage.totalDamage,
          isInfected: true,
          points: 0,
          BattleEventId: this.event.id
        }),
      new BattleResult(
        {
          status: 'disconnect',
          coins: 0,
          AvatarId: this.player.two.avatar.id,
          time: this.player.two.state.score.getTime(),
          totalDamage: this.player.two.state.score.damage.totalDamage,
          isInfected: true,
          points: 0,
          BattleEventId: this.event.id
        })).then(() => {
          self.io.emit('exception', error.toString());
        }).catch(function (e) {
          logger.error(e);
          self.cleanup();
        })
  }

  findPlayerById(avatarId: number): Player {
    if (this.player.one.avatar.id === avatarId) {
      return this.player.one;
    }
    else if (this.player.two.avatar.id === avatarId) {
      return this.player.two;
    }
    return null;
  }

  async saveFinalState(player1: BattleResult, player2: BattleResult, isDisconnect: boolean = false) {
    if (!this.isSaving) {
      this.isSaving = true;
      
      console.log('saving final state');

      this.resetForceSwapTimeout();
      clearInterval(this.pingInterval);
      clearInterval(this.tickBandwidthInterval);
      clearTimeout(this.speedCheckTimeout);
      clearTimeout(this.battleTimeout);

      
      await this.event.tally(player1, player2, isDisconnect);

      this.cleanup();
    }
  }

  cleanup() {

    this.player.one.unbindEvents();
    this.player.one.close();
    this.player.two.unbindEvents();
    this.player.two.close();

    this.serviceNotifier.emit('end', this);
    this.player.one = null;
    this.player.two = null;
    this.serviceNotifier = null;
    this.event = null;
    this.history = null;
    this.isActive = false;
    this.battleTimeout = null;
  }

  invite(user: Account) {
    var result = this.invitees.add(user.id);
  }

  join(player: Player): void {
    console.log('joining');

    if (this.player.one == null) {
      this.player.one = player;
    }
    else if (this.player.two == null) {
      this.player.two = player;
    }
    else {
      throw new Error("Event is full");
    }

    player.setVictoryAction(this.beginVictory.bind(this));
    player.setQueueAction(this.beginQueue.bind(this));
    player.setReflectAction(this.beginReflect.bind(this));
    player.setErrorAction(this.error.bind(this));
    player.setForceSwapAction(this.beginForceSwapTimeout.bind(this));
    player.setResetForceSwapAction(this.resetForceSwapTimeout.bind(this));

    player.sendInfo(this.event.id);
  }

  beginBattleTimeout() {
    try {
      //this.error(new Error('timeout'));
    }
    catch (e) {
      this.error(e);
    }
  }

  beginVictory(winner: PlayerState): void {
    //type of winner
    var self = this;
    try {
      var winnerType = winner.getType();
      var target = winner.getTarget();

      this.saveFinalState(
        new BattleResult(
          {
            status: this.player.one.state === winner ? 'win' : 'loss',
            coins: 0,
            AvatarId: this.player.one.avatar.id,
            time: this.player.one.state.score.getTime(),
            totalDamage: this.player.one.state.score.damage.totalDamage,
            isInfected: this.player.two.state.isInfected(),
            points: this.player.one.state.score.getPoints(),

            BattleEventId: this.event.id
          }),
        new BattleResult(
          {
            status: this.player.two.state === winner ? 'win' : 'loss',
            coins: 0,
            AvatarId: this.player.two.avatar.id,
            time: this.player.two.state.score.getTime(),
            totalDamage: this.player.two.state.score.damage.totalDamage,
            points: this.player.two.state.score.getPoints(),
            isInfected: this.player.one.state.isInfected(),
            BattleEventId: this.event.id
          })).catch(function (e) {
            self.error(e);
          });
    }
    catch (e) {
      this.error(e);
    }
  }

  beginPing() {
    try {
      this.player.one.ping.startPing();
      this.player.two.ping.startPing();
    }
    catch (e) {
      this.error(e);
    }
  }

  start() {
    const self = this;
    async.until(() => self.player.one != null && self.player.two != null, function (callback) {
      setTimeout(callback, 200);
    }, this.beginReady.bind(this));
  }

  beginReady(err) {
    if (err) {
      throw new Error();
    } else {
      try {
        this.begin();
      }
      catch (e) {
        this.error(e);
      }
    }
  }

  begin() {
    console.log('start');

    this.player.one.setTarget(this.player.two);
    this.player.two.setTarget(this.player.one);

    this.pingInterval = setInterval(this.beginPing.bind(this), consts.PING_INTERVAL);
    this.tickBandwidthInterval = setInterval(this.beginTickBandwidth.bind(this), consts.BANDWIDTH_INTERVAL);

    this.player.one.bindEvents();
    this.player.two.bindEvents();
    this.player.one.serverSwap(1);
    this.player.two.serverSwap(1);

    this.player.one.lock();
    this.player.two.lock();

    this.speedCheckTimeout = setTimeout(this.beginUnlock.bind(this), consts.FIRST_ATTACK_TIMEOUT);
    this.battleTimeout = setTimeout(this.beginBattleTimeout.bind(this), consts.BATTLE_TIMEOUT);
  }

  beginTickBandwidth() {
    try {

      this.player.one.tickBandwidth();
      this.player.two.tickBandwidth();
    }
    catch (e) {
      this.error(e);
    }
  }

  beginForceSwapTimeout(id: number) {
    try {
      const player = this.findPlayerByClientId(id);
      this.forceSwapTimeout = setTimeout(this.beginForceSwap.bind(this, player), 30000);
    }
    catch (e) {
      this.error(e)
    }
  }

  resetForceSwapTimeout() {
    clearTimeout(this.forceSwapTimeout);
  }
  //after timeout for swapping after death force swap
  beginForceSwap(player: Player) {
    try {
      console.log('Begin force swap');
      if (player.getState().isWaiting()) {
        //If the current monster is alive, force commit to it
        const isAlive = player.getState().getActiveKaiScript().isAlive();

        if (isAlive) {
          player.serverCommit();
        }
        else {
          //otherwise move right and force commit to next monster
          player.swapper.swap(1, true);
        }
      }

    }
    catch (e) {
      this.error(e);
    }
  }

  beginUnlock() {
    try {
      console.log('unlock players');

      this.player.one.unlock();
      this.player.two.unlock();
    }
    catch (e) {
      this.error(e);
    }
  }

  findPlayerByClientId(id: number) {
    if (this.player.one.client.id === id) {
      return this.player.one;
    }
    else if (this.player.two.client.id === id) {
      return this.player.two;
    }
    else {
      throw new Error('Invalid client ID')
    }
  }

  beginReflect(id: number, attack: Attack): void {
    try {
      const player = this.findPlayerByClientId(id);
      player.reflect(new (<any>attack.constructor)(player.getState()));
    }
    catch (e) {
      this.error(e);
    }
  }

  beginQueue(event: IHistoryEvent): void {
    try {
      this.history.push(event);
      this.history = this.history.slice(0, 20);
    }
    catch (e) {
      this.error(e);
    }
  }

  historyString(id: number): { type: string } {
    var filter = _.filter(this.history, (x) => x.id === id);
    return filter.reduce(function (a, b) {
      return { type: a.type + b.type }
    }, { type: '' })
  }
}

export interface IQueueAction {
  (event: IHistoryEvent): void;
}

export interface IReflectAction {
  (id: number, attack: Attack): void;
}

export interface IVictoryAction {
  (state: PlayerState): void;
}

export interface IErrorAction {
  (error: Error): void;
}

export interface IForceSwapAction {
  (id: number): void;
}

export interface IResetForceSwapAction {
  (): void;
}

export interface IHistoryEvent {
  playerId: number
  type: 'Attack' | 'Swap' | 'Kill' | 'Death'
  detail: {
    killer: AvatarKaiScript
  }
}

