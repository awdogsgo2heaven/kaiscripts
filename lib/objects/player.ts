'use strict';

import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import * as Util from "../helpers";
import * as shortid from 'shortid';
import GameTimer from './timer';
import PlayerState from './player-state';
import PlayerPing from './player-ping';
import * as SocketIO from 'socket.io';
import PlayerEmitter from './player-emitter';
import PlayerCasterComponent from './player-caster-component';
import PlayerConsumerComponent from './player-consumer-component';
import PlayerSwapperComponent from './player-swapper-component';
import {PlayerAttackerComponent} from './player-attacker-component';
import Attack from '../attacks/attack';
import {Account} from '../data/account';
import {IAvatarSql} from '../data/avatar';
import {IAvatarKaiScriptSql} from '../data/avatar-kai-script';
import {IAvatarItemSql} from '../data/avatar-item';
import {NotImplementedError} from '../errors';

import {IQueueAction, IReflectAction, IVictoryAction, IErrorAction, IForceSwapAction, IResetForceSwapAction} from './battle';

export type PlayerOptions = {
  id: number,
  avatar: IAvatarSql,
  kaiScripts: IAvatarKaiScriptSql[],
  battleCache: IAvatarItemSql[],
  antiViralCount: number,
  type: string,
  matchType: string
}

export default class Player {

  public state: PlayerState
  public client: PlayerEmitter;
  public ping: PlayerPing;
  public caster: PlayerCasterComponent;
  public attacker: PlayerAttackerComponent;
  public swapper: PlayerSwapperComponent;
  public consumer: PlayerConsumerComponent;
  public avatar: IAvatarSql
  public resetForceSwapAction: IResetForceSwapAction

  constructor(public options: PlayerOptions, public socket: SocketIO.Namespace) {
    this.client = new PlayerEmitter(options, this.socket);
    this.ping = new PlayerPing(this.socket);
    this.avatar = options.avatar;
    this.state = new PlayerState(options, this.client);
    this.caster = new PlayerCasterComponent(this.state, this.client);
    this.attacker = new PlayerAttackerComponent(this.state, this.client);
    this.swapper = new PlayerSwapperComponent(this.state, this.client);
    this.consumer = new PlayerConsumerComponent(this.state, this.client);
  }

  getType(): string {
    return this.getState().getType();
  }

  getClient(): PlayerEmitter {
    return this.client;
  }

  getState(): PlayerState {
    return this.state;
  }

  bindEvents(): void {
    throw new NotImplementedError('bindEvents function needed.');
  }

  unbindEvents(): void {
    throw new NotImplementedError('bindEvents function needed.');
  }

  sendInfo(eventId: number): void {
    this.getClient().sendInfo(this.getState().battleCache, eventId, this.options.antiViralCount);
  }

  setVictoryAction(callback: IVictoryAction): void {
    var self = this;
    self.getClient().setVictoryAction(callback);
  }

  setQueueAction(callback: IQueueAction): void {
    this.getState().setQueueAction(callback);
  }

  setReflectAction(callback: IReflectAction): void {
    this.getState().setReflectAction(callback);
  }

  setErrorAction(callback: IErrorAction): void {
    this.getState().setErrorAction(callback);
  }

  setForceSwapAction(callback: IForceSwapAction): void {
    this.getState().setForceSwapAction(callback);
  }

  setResetForceSwapAction(callback: IResetForceSwapAction): void {
    this.resetForceSwapAction = callback;
  }

  error(error: Error) {
    this.getState().error(error);
  }

  setTarget(target: Player): void {
    var self = this;
    self.getState().setTarget(target);
  }

  removeTarget(): void {
    var self = this;
    self.getState().removeTarget();
  }

  lock(): void {
    this.getState().lock();
  }

  unlock(): void {
    var self = this;
    self.getState().unlock();
  }

  reflect(attack: Attack): void {
    var self = this;
    try {
      self.caster.reflect(attack, self.finishedAttack.bind(this));
    }
    catch (e) {
      this.error(e);
    }
  }

  endPing(): void {
    var self = this;
    try {
      self.ping.endPing();
    }
    catch (e) {
      this.error(e);
    }
  }

  close(): void {
    try {
      this.client.finish(this.getState().isWinner);
    }
    catch (e) {
      console.log(e);
      this.error(e);
    }
  }

  serverQuit(): void {
    try {
      this.error(new Error('disconnect'));
    }
    catch (e) {
      console.log(e);
      this.error(e);
    }
  }

  serverUseAntiViral(): void {
    try {
        this.consumer.useAntiViral();
    }
    catch (e) {
      this.error(e);
    }
  }

  serverUseItem(position: number): void {
    try {
      console.log(position);
      if (position < 5 && position > 0) {
        this.consumer.use(position);
      }
      else if(position === -1 && this.options.antiViralCount > 0) {
        this.serverUseAntiViral();
      }
    }
    catch (e) {
      this.error(e);
    }
  }

  serverSetAttack(position: number): void {
    try {
      if (position < 5 && position > 0) {
        this.caster.cast(position, this.finishedAttack.bind(this));
      }
    }
    catch (e) {
      this.error(e);
    }
  }

  finishedAttack(): void {
    try {

      this.attacker.attack();
    }
    catch (e) {
      this.error(e);
    }
  }

  serverCancelAttack(): void {
    var self = this;
    try {
      self.caster.cancel();
    }
    catch (e) {
      this.error(e);
    }
  }

  serverHotSwap(direction: number): void {
    var self = this;
    try {
      if (this.getState().isSwitchable()) {
        self.swapper.swap(direction);
      }      
    }
    catch (e) {
      this.error(e);
    }
  }

  serverCommit(): void {
    var self = this;
    try {
      self.swapper.commit();
      self.resetForceSwapAction();
    }
    catch (e) {
      this.error(e);
    }
  }

  serverSwap(position: number): void {
    var self = this;
    try {
      self.swapper.next();
    }
    catch (e) {
      this.error(e);
    }
  }

  tickBandwidth(): void {
    this.getState().tickBandwidth();
  }
}
