'use strict';

import * as consts from '../config/constants';
/* global -Promise */
import * as _ from 'underscore';
import * as shortid from 'shortid';
import Player from './player';
import * as Util from "../helpers";
import Attack, {AttackReaction} from '../attacks/attack';
import {ElementType} from '../helpers/common';
import Frozen from '../statuses/frozen';
import * as Promise from 'bluebird';
import Status from '../statuses/status';
import PlayerScore from './player-score';
import GameTimer from './timer';
import PlayerEmitter from './player-emitter';
import {AvatarKaiScript, IAvatarKaiScriptSql} from '../data/avatar-kai-script';
import {PlayerKaiScript} from './player-kai-script';
import { PlayerDamage } from './player-damage';

import {AvatarItem, IAvatarItemSql} from '../data/avatar-item';
import {Avatar} from '../data/avatar';
import {AvatarKaiScriptAttack} from '../data/avatar-kai-script-attack';
import Item from '../items/item';
import {ValidationError, NotFoundError} from '../errors';
import {IQueueAction, IReflectAction, IVictoryAction, IHistoryEvent, IErrorAction, IForceSwapAction} from './battle';
import {IAttackAction} from './player-attacker-component';
import {PlayerOptions} from './player';
import CircularIterator from './circular-iterator';
import {IEffect, EffectType} from "../helpers/common";

export default class PlayerState {

  public kaiScripts: CircularIterator<PlayerKaiScript>
  public avatar: Avatar
  public battleCache: Item[]
  public score: PlayerScore
  private client: PlayerEmitter
  private type: string
  public isDead: boolean = false;
  private isCooling: boolean = false;
  public isCasting: boolean = false;
  public activeKaiScriptId: number = null;
  public attackHistory: string[] = [];
  public activeAttack: Attack = null;
  public activeItem: Item = null;
  public fieldType: ElementType = null;
  public totalBandwidth: number = 100.0;
  public bandwidth: number = 0;
  public isAnimating: boolean = false;
  private freezeCount: number = 0;
  public isWinner: boolean = false;
  private target: PlayerState
  private isLocked: boolean = true;
  public comboMomentum: number = 0;
  private castingTimer: GameTimer;
  public reflectAction: IReflectAction;
  public queueAction: IQueueAction;
  public errorAction: IErrorAction;
  public forceSwapAction: IForceSwapAction;
  public attackTimeout: NodeJS.Timer;

  constructor(options: PlayerOptions, client: PlayerEmitter) {
    var self = this;
    this.avatar = new Avatar(options.avatar);

    var id = 0;

    this.kaiScripts = new CircularIterator<PlayerKaiScript>(_.map(options.kaiScripts, function (data: IAvatarKaiScriptSql) {
      var kaiScript = new PlayerKaiScript(new AvatarKaiScript(data), self);

      if (options.matchType !== 'wild') {
        kaiScript.data.health = kaiScript.totalHealth;
      }
      else if (options.matchType === 'wild' && options.type === 'invader') {
        kaiScript.data.health = kaiScript.totalHealth;
        kaiScript.viral = kaiScript.data.totalViral;
        kaiScript.isInfected = true;
      }

      kaiScript.clientId = ++id;
      return kaiScript;
    }));

    id = 0;
    this.battleCache = _.map(options.battleCache, function (data: IAvatarItemSql) {
      var item = AvatarItem.fromJSON(data);
      var itemobj = new item.item(self, item.slot);
      itemobj.clientId = ++id;
      return itemobj;
    });

    this.client = client;
    this.type = options.type;

    this.score = new PlayerScore(options);
  }

  getActiveAttacks(): Attack[] {
    var kaiScript = this.getActiveKaiScript();
    return kaiScript.attacks;
  }

  getType(): string {
    return this.type;
  }

  getClient() {
    return this.client;
  }

  getScore() {
    return this.score;
  }

  setTarget(target: Player) {
    if (target && target instanceof Player) {
      this.target = target.getState();
      this.getClient().addListeners(target);
      return true;
    }
    throw new Error('Target is not a Player')
  }

  getTarget(): PlayerState {
    return this.target;
  }

  isInfected(): boolean {
    return this.getActiveKaiScript().isInfected;
  }

  removeTarget() {

    this.target = null;
    this.setCastingTimer(null);
    clearTimeout(this.attackTimeout);

    for (var kaiScript of this.kaiScripts.array) {
      kaiScript.statuses.forEach(function (status) {
        clearInterval(status.timerId);
      });
    }

    //self.getCastingTimer().pause();

  }

  isGameOver() {
    return this.getKaiScriptAliveCount() === 0;
  }

  lock() {
    var target = this.getTarget().getActiveKaiScript();
    var player = this.getActiveKaiScript();

    //player with lower latency gets unlocked first
    if (player.totalLatency !== target.totalLatency) {
      this.isLocked = (player.totalLatency > target.totalLatency);
    } else {
      this.isLocked = !this.getTarget().isLocked;
    }
    //start battle timer
    this.getScore().startTime();
    this.getClient().locked(this.isLocked);
  }

  unlock() {
    if (this.isLocked) {
      this.isLocked = false;
      this.getClient().locked(this.isLocked);
    }
  }

  getBandwidth(): number {
    return this.bandwidth;
  }

  getItem(position: number) {
    if (position > 0 && position < 5) {
      return this.battleCache[position - 1] || null;
    }
    return null;
  }

  incBandwidth(bandwidth: number): number {
    const pre = this.bandwidth;
    const post = pre + bandwidth;

    if (post > this.totalBandwidth) {
      this.bandwidth = this.totalBandwidth;
      this.freeze(this.getActiveKaiScript());
      return this.bandwidth - pre;
    }

    this.bandwidth = Util.clamp(post, 0, this.totalBandwidth);

    return this.bandwidth - pre;
  }


  setFieldType(fieldType: ElementType) {
    var self = this;
    self.fieldType = fieldType;
  }

  getFieldType(): ElementType {
    return this.fieldType;
  }

  setQueueAction(callback: IQueueAction) {
    this.queueAction = callback;
  }

  setReflectAction(callback: IReflectAction) {
    this.reflectAction = callback;
  }

  setErrorAction(callback: IErrorAction) {
    this.errorAction = callback;
  }

  setForceSwapAction(callback: IForceSwapAction) {
    this.forceSwapAction = callback;
  }

  error(error: Error) {
    this.errorAction(error);
  }

  reflect(attack: Attack) {
    const kaiScript = this.getActiveKaiScript();
    this.reflectAction(this.client.id, attack);
    kaiScript.findAndRemoveStatus('Reflect');
  }

  queue(type, action) {
    this.queueAction({
      playerId: this.client.id,
      type: type,
      detail: action
    });
  }

  forceSwap() {
    this.forceSwapAction(this.client.id);
  }

  setIsWinner(winner: boolean) {
    this.isWinner = winner;
  }

  getComboMomentum(): number {
    return this.comboMomentum;
  }

  incComboMomentum(): void {
    this.comboMomentum += 1;
  }

  cancelComboMomentum(): void {
    this.comboMomentum = 0;
  }

  getKaiScript(position: number): PlayerKaiScript {

    var kaiScript = this.kaiScripts.now();

    if (kaiScript) {
      return kaiScript;
    }
    return null;
  }

  isKaiScriptAlive(position: number): boolean {
    var kaiScript = _.find(this.getKaiScripts(), (x) => x.teamOrder === position);
    if (kaiScript) {
      if (kaiScript.health > 0) {
        return true;
      }
    }
    return false;
  }

  getKaiScripts(): PlayerKaiScript[] {
    return this.kaiScripts.array;
  }

  getLivingKaiScripts(): PlayerKaiScript[] {
    return _.filter(this.getKaiScripts(), () => true);
  }

  kill(): void {
    this.setIsCasting(false);
    this.setCastingTimer(null);
    this.setIsAnimating(false);
    this.pauseStatuses();
    clearTimeout(this.attackTimeout);

    const target = this.getTarget();

    this.score.addVictory(target.getActiveKaiScript());

    target.die();


    if (target.isGameOver()) {
      this.setIsWinner(true);
      this.getClient().victory(this);
    }
  }

  die(): void {
    this.setIsAnimating(false);
    this.pauseStatuses();
    this.setIsWaiting(true);
    this.setIsCasting(false);
    clearTimeout(this.attackTimeout);
    this.setCastingTimer(null);

    console.log('Target died, is game over?')
    console.log(this.isGameOver());
    if (!this.isGameOver()) {
      this.forceSwap();
    }
  }

  getActiveKaiScript(): PlayerKaiScript {
    const kaiScript = this.kaiScripts.now();
    if (kaiScript) {
      return kaiScript;
    } else {
      throw new Error('No Active KaiScript Found.');
    }
  }

  setActiveKaiScript(kaiScript: PlayerKaiScript): void {
    this.activeKaiScriptId = kaiScript.clientId;
  }

  getActiveAttack(): Attack {
    return this.activeAttack;
  }

  getActiveItem(): Item {
    return this.activeItem;
  }

  setActiveAttack(attack: Attack) {
    this.activeAttack = attack;
    this.attackHistory.push(attack.toSymbol());
    this.attackHistory = this.attackHistory.slice(0, 20);
  }

  setActiveItem(item: Item) {
    this.activeItem = item;
  }

  getKaiScriptAliveCount() {
    return this.kaiScripts.array.filter(x => x.isAlive()).length
  }

  setIsAnimating(lock: boolean): void {
    this.isAnimating = lock;
    clearTimeout(this.attackTimeout)
  }

  setIsCooling(lock: boolean): void {
    this.isCooling = lock;
  }

  isWaiting() {
    return this.isDead || this.getTarget().isDead
  }

  setIsWaiting(lock: boolean): void {
    this.isDead = lock;
  }

  setIsCasting(cast: boolean): void {
    this.isCasting = cast;
  }

  getCastingTimer() {
    return this.castingTimer;
  }

  setCastingTimer(timer) {
    if (this.castingTimer) {
      this.castingTimer.pause();
    }
    this.castingTimer = timer;
  }

  startAnimation(animationTime: number, callback: IAttackAction) {
    this.setIsAnimating(true);
    const target = this.getTarget();
    if (target.isCasting) {
      target.pauseCastingTimer();
    }
    this.attackTimeout = setTimeout(callback, animationTime * 1000);
  }

  endAnimation() {
    const target = this.getTarget();

    if (this.isAnimating) {
      if (target.isCasting) {
        target.startCastingTimer();
      }
      this.setIsAnimating(false);
    }
  }

  startCastingTimer(): void {
    this.getCastingTimer().resume();
  }

  pauseCastingTimer(): void {
    this.getCastingTimer().pause();
  }

  update(): void {
    const kaiScript = this.getActiveKaiScript();
    const target = this.getTarget();
    const targetKaiScript = target.getActiveKaiScript();
    if (!kaiScript.isAlive()) {
      this.queue('Death', { killer: targetKaiScript, victim: kaiScript });
      target.kill();
    }
    else if (!targetKaiScript.isAlive()) {
      this.queue('Kill', { killer: kaiScript, victim: targetKaiScript });
      this.kill();
    }
  }

  isBusy(): boolean {
    const kaiScript = this.getActiveKaiScript();
    const target = this.getTarget();
    return !this.isAttackable() ||
      this.isWaiting() ||
      kaiScript.hasStatus('Sleep')
  }



  isAttackable(): boolean {
    var target = this.getTarget();
    return !(this.isCasting ||
      this.isAnimating ||
      this.isLocked);
  }

  isSwitchable(): boolean {
    const target = this.getTarget();
    const kaiScript = this.getActiveKaiScript();

    return !(kaiScript.isTrapped() || this.isCasting ||
      this.isAnimating ||
      this.isLocked ||
      kaiScript.hasStatus('Sleep') ||
      target.isAnimating);
  }


  tickBandwidth(): void {
    if (this.activeKaiScriptId && !this.isWaiting() ){
      var recovery = consts.BATTLE_RECOVERY_MOD;
      const kaiScript = this.getActiveKaiScript();
      const isIdle = kaiScript.hasStatus('Idle');

      for (const status of kaiScript.statuses) {
        var name = status.name;
        recovery += status.bandwidthTick() || 0;
      }

      //idling monsters can not recovery
      this.incBandwidth(isIdle ? 0 : -recovery);
      this.getClient().bandwidth(this.bandwidth);

    }
  }

  startStatuses() {
    const kaiScript = this.getActiveKaiScript();
    kaiScript.startStatuses();
  }

  pauseStatuses() {
    const kaiScript = this.getActiveKaiScript();
    kaiScript.pauseStatuses();
  }

  freeze(kaiScript: PlayerKaiScript): Status {
    this.freezeCount = Util.clamp(this.freezeCount + 1, 0, 3);
    var ticks = 5 * this.freezeCount;

    var freezeStatus = new Frozen(ticks);

    kaiScript.addStatus(freezeStatus);

    return freezeStatus;
  }

  //TRIGGERS

  triggerTryCast(state: { position: number }) {
    const kaiScript = this.getTarget().getActiveKaiScript();
    for (const status of kaiScript.statuses) {
      const isTriggered = status.triggerTryCast(state);
      if (isTriggered) {

      }
    }
    
    return [];
  }
  triggerAddStatus(status: Status): IEffect[] {
    const kaiScript = this.getTarget().getActiveKaiScript();

    for (const equipment of kaiScript.equipment) {
      const isTriggered = equipment.triggerAddStatus(status);
      if (isTriggered) {

      }
    }
    
    return [];
  }
  

  triggerReaction(playerDamage: PlayerDamage): IEffect[] {
    const kaiScript = this.getTarget().getActiveKaiScript();
    for (const status of kaiScript.statuses) {
      const isTriggered = status.triggerReaction(playerDamage);
      if (isTriggered) {

      }
    }

    for (const equipment of kaiScript.equipment) {
      const isTriggered = equipment.triggerReaction(playerDamage);
      if (isTriggered) {

      }
    }
    
    return [];
  }


  triggerAttack(): IEffect[] {
    const kaiScript = this.getActiveKaiScript();
    for (const status of kaiScript.statuses) {
      const isTriggered = status.triggerAttack();
      if (isTriggered) {

      }
    }


    for (const equipment of kaiScript.equipment) {
      const isTriggered = equipment.triggerAttack();
      if (isTriggered) {

      }
    }
    
    return [];
  }

  triggerDamage(playerDamage: PlayerDamage): number[] {
    const procs = []
    const kaiScript = this.getTarget().getActiveKaiScript();
    for (const status of kaiScript.statuses) {
      const isTriggered = status.triggerDamage(playerDamage);
      if (isTriggered) {
        procs.push(status.clientId);
      }
    }
    for (const equipment of kaiScript.equipment) {
      const isTriggered = equipment.triggerDamage(playerDamage);
      if (isTriggered) {

      }
    }

    return procs;
  }

  triggerHit(): IEffect[] {
    const kaiScript = this.getTarget().getActiveKaiScript();
    for (const status of kaiScript.statuses) {
      const isTriggered = status.triggerHit();
      if (isTriggered) {

      }
    }
    for (const equipment of kaiScript.equipment) {
      const isTriggered = equipment.triggerHit();
      if (isTriggered) {

      }
    }

    return [];
  }

}
