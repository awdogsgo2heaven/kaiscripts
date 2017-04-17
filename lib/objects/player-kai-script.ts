'use strict';

import * as _ from 'underscore';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {AvatarItem} from '../data/avatar-item';
import * as Util from "../helpers";

import PlayerState from './player-state';
import {ElementType} from '../helpers/common';
import Attack from '../attacks/attack';
import Item from '../items/item';
import Status from '../statuses/status';

export class PlayerKaiScript {

  public clientId: number
  public viral: number = 0;
  public isInfected: boolean = false;
  public attacks: Attack[]
  public equipment: Item[]
  public statusCounter: number = 0

  constructor(public data: AvatarKaiScript, public state: PlayerState) {
    var i = 0;
    this.attacks = data.attacks.map((attack: typeof Attack) => new attack(this.state, i++));
    this.equipment = data.equipment.map((avatarItem: AvatarItem) => new avatarItem.item(this.state, avatarItem.slot));

  }

  public get name() {
    return this.data.name;
  }

  public get trait() {
    return this.data.trait;
  }

  public get virus() {
    return this.data.virus;
  }

  public get base() {
    return this.data.base;
  }

  public get statuses() {
    return this.data.statuses;
  }

  public get snapshot() {
    var snap = this.data.snapshot;
    snap.viral = this.viral;
    return snap;
  }

  public get totalHealth() {
    return this.data.totalHealth;
  }

  public get health() {
    return this.data.health;
  }

  public get healthRatio() {
    return this.data.healthRatio;
  }

  get viralRatio(): number {
    return Math.round((this.viral / this.data.totalViral) * 100.0) / 100.0;
  }

  public get totalAttack() {
    return this.data.totalAttack;
  }

  public get totalSecurity() {
    return this.data.totalSecurity;
  }

  public get totalIntelligence() {
    return this.data.totalIntelligence;
  }

  public get totalKnowledge() {
    return this.data.totalKnowledge;
  }

  public get totalResiliency() {
    return this.data.totalResiliency;
  }

  public get totalLatency() {
    return this.data.totalLatency;
  }

  public isAlive() {
    return this.data.isAlive();
  }

  public isTrapped() {
    return this.data.isTrapped();
  }


  public incHealth(offset: number): number {
    if (this.viral > 0 && offset < 0) {
      return this.incViral(offset);
    }

    return this.data.incHealth(offset);
  }

  incViral(offset: number): number {
    const viralNow = this.viral;
    const newViral = Util.clamp(viralNow + offset, 0, this.data.totalViral);
    this.viral = newViral;
    return Math.abs(viralNow - this.viral);
  }

  public updateStatMods() {
    this.data.updateStatMods();
  }

  public hasStatus(symbol: string) {
    return this.data.hasStatus(symbol);
  }

  public findStatus(symbol: string) {
    return this.data.findStatus(symbol);
  }

  public addStatus(status: Status) {
    status.state = this.state;

    const isAdded = this.data.pushStatus(status);
    if (isAdded) {
      this.statusCounter++;
      
      this.state.triggerAddStatus(status);

      var newStatus = this.data.statuses[this.statuses.length - 1];
      newStatus.clientId = this.statusCounter;
      newStatus.timerId = setInterval(this.beginTickStatus.bind(this), 3000, this.clientId, newStatus);
      this.state.getClient().addStatus(this.data, newStatus);
    } else {
      //need to add no effect call here
      this.state.getClient().addStatus(this.data, null);
    }
  }
  findAndRemoveStatus(name: string): void {
    const status = this.findStatus(name);
    if (status) {
      this.removeStatus(status);
    }
  }

  findAndRemoveTrickStatus(): void {
    var status = this.statuses.find(x => x.isTrick);
    if (status) {
      this.removeStatus(status);
    }
  }

  removeStatus(status: Status): void {

    clearInterval(status.timerId);

    const index = this.statuses.indexOf(status);
    if (index > -1) {
      this.statuses.splice(index, 1);
    }
    //remove expired statuses
    this.state.getClient().removeStatus(this.data, status);
  }

  beginTickStatus(id: number, status: Status) {
    try {
      this.tickStatus(id, status);
    }
    catch (e) {
      this.state.error(e);
    }
  }

  tickStatus(id: number, status: Status): void {
    if (this.state.activeKaiScriptId === id && !this.state.isWaiting()) {
      var effect;
      const ticksLeft = status.ticks;
      const name = status.name;

      if (ticksLeft > 0) {
        effect = status.statusTick(this.data);

        if (effect && effect.damage) {
          var score = this.state.getTarget().getScore();
          score.addDamage(effect.damage, ElementType.None);
        }

        status.ticks -= 1;
      }

      if (status.ticks <= 0) {
        this.state.getClient().updateStatus({
          clientId: this.clientId,
          attacker: this.state.getActiveKaiScript().snapshot,
          defender: this.state.getTarget().getActiveKaiScript().snapshot
        }, status, effect);

        this.removeStatus(status);
      } else {
        this.state.getClient().updateStatus({
          clientId: this.clientId,
          attacker: this.state.getActiveKaiScript().snapshot,
          defender: this.state.getTarget().getActiveKaiScript().snapshot
        }, status, effect);
      }
      var target = this.state.getTarget();
      target.update();
      this.state.update();
    }

  }

  startStatuses() {
    for (const status of this.statuses) {
      status.timerId = setInterval(this.beginTickStatus.bind(this), 3000, this.clientId, status);
    }
  }

  pauseStatuses() {
    for (const status of this.statuses) {
      clearInterval(status.timerId);
    }
  }

}
