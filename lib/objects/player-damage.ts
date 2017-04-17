'use strict';

import Attack, {AttackType, AttackAccuracy, AttackReaction, IStatusProcResult, IAttackResult, AttackPotency, IDamageResult} from '../attacks/attack';
import * as Util from "../helpers";
import {IEffect, EffectType} from "../helpers/common";
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';
import WeightMachine from '../objects/weight-machine';
import PlayerState from '../objects/player-state';
import {PlayerKaiScript} from '../objects/player-kai-script';
import * as Collections from 'typescript-collections';
import {IBattleTrigger} from '../objects/triggers';


export interface IAttack {
  elementType: ElementType
  type: AttackType
  bandwidthDamage?: number
  toSymbol(): string
}

export interface IPotentableAttack {
  potencies: Collections.Dictionary<ElementType, ElementType>
  weaknesses: Collections.Dictionary<ElementType, ElementType>
}

export interface ICombinativeAttack {
  combos: Collections.Dictionary<ElementType, ElementType>
}

export interface IReactiveAttack {
  critRate: number
  counterRate: number
  blockRate: number
}

export enum DamageFeatures {
  Calculative = 0,
  Potent = 1 << 0,
  Combinative = 1 << 1,
  Reactive = 1 << 2,
  Triggerable = 1 << 3
}

export class PlayerDamage {

  public damage: number = 0;
  public counterDamage: number = 0;
  public potency: AttackPotency;
  public accuracy: AttackAccuracy;
  public isCombo: boolean = false;
  public potentAttack: IPotentableAttack
  public reactiveAttack: IReactiveAttack
  public combinativeAttack: ICombinativeAttack;
  public procs: number[]

  constructor(public baseDamage: number, public attack: IAttack, public attackerState: PlayerState, public defenderState: PlayerState) {
    this.damage = this.baseDamage;
  }

  calculative(): PlayerDamage {
    this.damage = this.getBaseDamage()
    return this;
  }

  elemental(potentAttack: IPotentableAttack): PlayerDamage {
    this.potentAttack = potentAttack;
    this.potency = this.getElementBonus();
    this.damage = this.getElementDamage(this.damage, this.potency);
    return this;
  }

  reactive(reactiveAttack: IReactiveAttack): PlayerDamage {
    this.reactiveAttack = reactiveAttack;
    this.accuracy = this.getReaction();
    this.attackerState.triggerReaction(this);
    this.damage = this.getReactionDamage(this.accuracy);
    return this;
  }

  combinative(combinativeAttack: ICombinativeAttack): PlayerDamage {
    this.combinativeAttack = combinativeAttack;
    this.isCombo = this.isComboDamage();
    this.damage = this.getComboDamage(this.isCombo);
    return this;
  }

  proc(): PlayerDamage {
    this.procs = this.getStatusProcs().procs;
    return this;
  }

  private potentFormula(damage): number {
    return damage * 1.5;
  }

  private weakFormula(damage): number {
    return damage * 0.5;
  }

  private get attacker(): PlayerKaiScript {
    return this.attackerState.getActiveKaiScript();
  }

  private get defender(): PlayerKaiScript {
    return this.defenderState.getActiveKaiScript();
  }

  private get hitChance(): number {
    return 100.0;
  }

  private isPotent(attack: ElementType, primary: ElementType, secondary: ElementType): boolean {
    var isPrimaryPotent = this.potentAttack.potencies.getValue(attack) === primary;
    var isSecondaryPotent = this.potentAttack.potencies.getValue(attack) === secondary;
    return (isPrimaryPotent || isSecondaryPotent) ? true : false;
  }

  private isWeak(attack: ElementType, primary: ElementType, secondary: ElementType): boolean {
    var isPrimaryWeak = this.potentAttack.weaknesses.getValue(attack) === primary;
    var isSecondaryWeak = this.potentAttack.weaknesses.getValue(attack) === secondary;
    return (isPrimaryWeak || isSecondaryWeak) ? true : false;
  }

  private critChanceFormula(attacker: PlayerKaiScript, defender: PlayerKaiScript): number {
    const baseChance = this.reactiveAttack.critRate;
    const aAttack = attacker.totalAttack;
    const bSpeed = defender.totalLatency;

    var chance = baseChance + (((aAttack * 1.5) - bSpeed));
    return chance;
  }

  private blockChanceFormula(attacker: PlayerKaiScript, defender: PlayerKaiScript): number {
    const baseChance = this.reactiveAttack.blockRate;
    const aDefense = attacker.totalSecurity;
    const bAttack = defender.totalAttack;

    var chance = baseChance + (((aDefense * 1.5) - bAttack));
    return chance;
  }

  private counterChanceFormula(attacker: PlayerKaiScript, defender: PlayerKaiScript): number {
    const baseChance = this.reactiveAttack.counterRate;
    const aSpeed = attacker.totalLatency;
    const bDefense = defender.totalSecurity;

    var chance = baseChance + (((aSpeed * 1.5) - bDefense));
    return chance;
  }

  private bruteFormula(aBase: number, attacker: PlayerKaiScript, defender: PlayerKaiScript): number {
    const aAttack = attacker.totalAttack;
    const bDefense = attacker.totalSecurity;
    const defenseDiff = Math.max(aAttack, 1) / Math.max(bDefense, 1);
    const b = (defenseDiff * aBase);

    const dmg = b;

    return dmg;
  }

  private technicalFormula(aBase: number, attacker: PlayerKaiScript, defender: PlayerKaiScript): number {
    const aAttack = attacker.totalIntelligence;
    const bDefense = attacker.totalKnowledge;
    const defenseDiff = Math.max(aAttack, 1) / Math.max(bDefense, 1);
    const b = (defenseDiff * aBase);

    const dmg = b;

    return dmg;
  }

  private getBaseDamage() {
    if (this.attack.type === AttackType.Technical) {
      return this.technicalFormula(this.baseDamage, this.attacker, this.defender);
    }
    else {
      return this.bruteFormula(this.baseDamage, this.attacker, this.defender);
    }
  }

  private getElementBonus(): AttackPotency {
    var attacker = this.attacker;
    var defender = this.defender;

    var isPotentAttk = this.isPotent(this.attack.elementType,
      defender.base.primaryType,
      defender.base.secondaryType);

    var isWeakAttk = this.isWeak(this.attack.elementType,
      defender.base.primaryType,
      defender.base.secondaryType);

    if (isPotentAttk !== isWeakAttk && isPotentAttk) {
      return AttackPotency.Potent;
    } else if (isPotentAttk !== isWeakAttk && isWeakAttk) {
      return AttackPotency.Weak;
    }
    return AttackPotency.None;
  }

  private getElementDamage(baseDamage: number, potency: AttackPotency): number {

    var typeAdvDamage = 0;

    if (potency === AttackPotency.Potent) {
      typeAdvDamage = this.potentFormula(baseDamage);
    } else if (potency === AttackPotency.Weak) {
      typeAdvDamage = this.weakFormula(baseDamage);
    } else {
      typeAdvDamage = baseDamage;
    }

    return (baseDamage);
  }

  private getReaction(): AttackAccuracy {

    if (this.attack.type === AttackType.Brute) {

      var attacker = this.attacker;
      var defender = this.defender;

      if (this.attack.toSymbol() === 'FireLance') {
        return AttackAccuracy.Critical;
      }

      if (defender.hasStatus('Counter Stance')) {
        return AttackAccuracy.Countered;
      }

      if (defender.hasStatus('Shield Stance')) {
        return AttackAccuracy.Blocked;
      }

      var blockWeight = this.blockChanceFormula(attacker, defender);

      var counterWeight = this.counterChanceFormula(attacker, defender);

      var critWeight = this.critChanceFormula(attacker, defender);

      const random = Util.roll();

      if (random < counterWeight) {
        return AttackAccuracy.Countered;
      }
      else if (random < blockWeight) {
        return AttackAccuracy.Blocked;
      }
      else if (random < critWeight) {
        return AttackAccuracy.Critical;
      }

      return AttackAccuracy.Normal;
    }
    return AttackAccuracy.Normal;
  }

  private getReactionDamage(reaction: AttackAccuracy): number {
    const self = this;
    var reactionDamage = 0;
    var attackerState = this.attackerState;
    var defenderState = this.defenderState;
    var defender = this.defenderState.getActiveKaiScript();

    var ccbModifier = 1.0;

    if (reaction === AttackAccuracy.Blocked) {
      ccbModifier -= 0.5;
    } else if (reaction === AttackAccuracy.Critical) {
      ccbModifier += 0.5;
    }
    else if (reaction === AttackAccuracy.Countered) {
      var counterModifier = 0.25;

      if (this.attacker.trait.toSymbol() === 'Redirection') {
        counterModifier = 0.35;
      }

      ccbModifier -= counterModifier;
    }

    reactionDamage = this.damage * ccbModifier;
    this.counterDamage = this.damage;

    return (reactionDamage);
  }

  private isComboDamage(): boolean {
    var defender = this.defenderState;
    var attack = this.attackerState.getActiveAttack();
    var isComboAtt = this.combinativeAttack.combos.getValue(defender.getFieldType()) === attack.elementType;
    return isComboAtt;
  }

  private getComboDamage(isCombo: boolean): number {

    var comboDamage = 0;
    if (isCombo) {
      this.attackerState.incComboMomentum();

      const momentum = this.attackerState.getComboMomentum();
      comboDamage = this.damage * 1.15 * momentum;

      if (this.attacker.trait.toSymbol() === 'Firestarter') {
        if (momentum === 1 && this.attack.elementType === ElementType.Fire) {
          comboDamage *= 2.0;
        }
      }
    } else {
      comboDamage = this.damage;
      this.attackerState.cancelComboMomentum();
    }
    return (comboDamage);
  }

  private getStatusProcs(): IStatusProcResult {

    const attacker = this.attackerState;
    const defender = this.defenderState;

    const procs = this.attackerState.triggerDamage(this);

    return {
      damage: this.damage,
      procs: procs
    };
  }


}
