'use strict';

import PlayerState from '../objects/player-state';
import { PlayerDamage } from '../objects/player-damage';

import { PlayerKaiScript } from '../objects/player-kai-script';
import { AvatarKaiScript } from '../data/avatar-kai-script';
import Status from '../statuses/status';

import { IEffect, EffectType } from '../helpers/common';
import { IBattleTrigger } from '../objects/triggers';
import { AttackReaction } from '../attacks/attack';
import * as consts from '../config/constants';

import { ValidationError, NotFoundError, BadRequestError } from '../errors';

export type ItemType = "battle" | "field" | "equipment" | "shader" | "anti-viral"
export interface IItemEffect {
  damage: number
  cure: number
}
export default class Item implements IBattleTrigger {

  public used: number
  public clientId: number

  constructor(public state: PlayerState, public slot: string) {
    this.used = 0;
  }

  static get name(): string {
    return '';
  }

  getState() {
    return this.state;
  }

  isUsable() {
    return this.used < this.usage;
  }

  get name(): string {
    return (this.constructor as typeof Item).name;
  }

  get isPassive(): boolean {
    return (this.constructor as typeof Item).isPassive;
  }

  get attacker(): PlayerKaiScript {
    return this.getState().getActiveKaiScript();
  }

  get defender(): PlayerKaiScript {
    return this.getState().getTarget().getActiveKaiScript();
  }

  static get isPassive(): boolean {
    return false;
  }

  static get desc(): string {
    return '';
  }

  get desc(): string {
    return (this.constructor as typeof Item).desc;
  }

  static get buyPrice(): number {
    return 0.0;
  }

  static get sellPrice(): number {
    return 0.0;
  }

  static get isAvailable(): boolean {
    return false;
  }

  static get itemType(): ItemType {
    return null;
  }

  get itemType(): ItemType {
    return (this.constructor as typeof Item).itemType;
  }

  static get baseCure(): number {
    return 0.0;
  }

  static get usage(): number {
    return 3;
  }

  get usage(): number {
    return (this.constructor as typeof Item).usage;
  }

  get baseCure(): number {
    return (this.constructor as typeof Item).baseCure;
  }

  public use(): IEffect {
    return { text: 'No Effect', type: EffectType.None }
  }

  public static async apply(kaiScript: AvatarKaiScript): Promise<IEffect> {
    return {
      text: 'No Effect',
      type: EffectType.None
    }
  }

  public static equip(kaiScript: AvatarKaiScript) {

  }

  static get accessibility() {
    return consts.StoreAccessbility.Rank1;
  }  
  
  static toSymbol() {
    return '';
  }

  triggerDeath(): boolean {
    return false;
  }

  triggerReaction(playerDamage: PlayerDamage): boolean {
    return false;
  }

  triggerTryCast(state: { position: number }): boolean {
    return true;
  }

  triggerAddStatus(status: Status): boolean {
    return false;
  }

  triggerCast(): boolean {
    return false;
  }

  triggerAttack(): boolean {
    return false;
  }

  triggerHit(): boolean {
    return false;
  }

  triggerDamage(state: { damage: number }): boolean {
    return false;
  }

}
