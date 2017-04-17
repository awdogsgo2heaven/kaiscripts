'use strict';

import * as Util from "../helpers";
import { IEffect, EffectType } from "../helpers/common";
import * as consts from '../config/constants';
import { ElementType } from '../helpers/common';
import WeightMachine from '../objects/weight-machine';
import PlayerState from '../objects/player-state';
import { PlayerKaiScript } from '../objects/player-kai-script';
import * as Collections from 'typescript-collections';
import { IBattleTrigger } from '../objects/triggers';
import { PlayerDamage, DamageFeatures } from '../objects/player-damage';

export enum AttackReaction {
  None,
  Counter,
  Drain,
  Recoil,
  Damage
}

export enum AttackAccuracy {
  Normal,
  Miss,
  Reflect,
  Countered,
  Blocked,
  Critical
}

export enum AttackEffect {
  None = 0,
  Damage = 1 << 0,
  Bandwidth = 1 << 1,
  Cure = 1 << 2,
  Viral = 1 << 3
}

export enum AttackPotency {
  None,
  Potent,
  Weak
}

export enum AttackType {
  Brute,
  Technical
}

export default class Attack {
  //fix state for Reflect
  constructor(public state: PlayerState, public order: number) {
  }

  static get name(): string {
    return '';
  }

  static get description(): string {
    return '';
  }

  get isPassive(): boolean {
    return (this.constructor as any).isPassive;
  }

  static get isPassive(): boolean {
    return false;
  }

  get name(): string {
    return (this.constructor as any).name;
  }

  get maxStack(): number {
    return 1;
  }

  get animationTime(): number {
    return 0;
  }

  static get type(): AttackType {
    return null;
  }

  get type(): AttackType {
    return (this.constructor as any).type;
  }

  get baseDamage(): number {
    return 0.0;
  }

  get baseCure(): number {
    return 0.0;
  }

  get bandwidthDamage(): number {
    return 0.0;
  }

  static get castTime(): number {
    throw new Error('No castTime defined.')
  }

  get castTime(): number {
    return (this.constructor as any).castTime;
  }

  get adjustedHitChance(): number {
    var multiplier = 1.0;
    this.attacker.statuses.forEach(function (status) {
      multiplier += status.hitChance;
    });
    return this.hitChance * multiplier;
  }


  get adjustedCastTime(): number {
    var multiplier = 1.0;
    this.attacker.statuses.forEach(function (status) {
      multiplier += status.castRate;
    });
    return this.castTime * multiplier;
  }

  get critRate(): number {
    return 5.0;
  }

  get blockRate(): number {
    return 0.0;
  }

  get counterRate(): number {
    return 0.0;
  }

  static get cost(): number {
    return 0.0;
  }

  get cost(): number {
    return (this.constructor as any).cost;
  }

  get adjustedCost(): number {

    var cost: number = this.cost;
    const isCursed = this.attacker.findStatus('Curse');
    const isSunGrazed = this.attacker.findStatus('Sun Graze');

    if (isCursed) {
      cost += isCursed.potency;
    }
    if (isSunGrazed) {
      cost /= 2.0;
    }
    return cost;
  }

  static get elementType(): ElementType {
    return null;
  }

  get elementType(): ElementType {
    return (this.constructor as typeof Attack).elementType;
  }

  public isComboDamage(): boolean {
    var isComboAtt = this.combos.getValue(this.state.getTarget().getFieldType()) === this.elementType;
    return isComboAtt;
  }

  get potencies(): Collections.Dictionary<ElementType, ElementType> {
    const dict = new Collections.Dictionary<ElementType, ElementType>();
    dict.setValue(ElementType.Wood, ElementType.Earth);
    dict.setValue(ElementType.Earth, ElementType.Water);
    dict.setValue(ElementType.Fire, ElementType.Metal);
    dict.setValue(ElementType.Metal, ElementType.Wood);
    dict.setValue(ElementType.Water, ElementType.Fire);
    return dict;
  }

  get combos(): Collections.Dictionary<ElementType, ElementType> {
    const dict = new Collections.Dictionary<ElementType, ElementType>();
    dict.setValue(ElementType.Wood, ElementType.Fire);
    dict.setValue(ElementType.Earth, ElementType.Metal);
    dict.setValue(ElementType.Fire, ElementType.Earth);
    dict.setValue(ElementType.Metal, ElementType.Water);
    dict.setValue(ElementType.Water, ElementType.Wood);
    return dict;
  }

  get weaknesses(): Collections.Dictionary<ElementType, ElementType> {
    const dict = new Collections.Dictionary<ElementType, ElementType>();
    dict.setValue(ElementType.Wood, ElementType.Earth);
    dict.setValue(ElementType.Earth, ElementType.Water);
    dict.setValue(ElementType.Fire, ElementType.Metal);
    dict.setValue(ElementType.Metal, ElementType.Wood);
    dict.setValue(ElementType.Water, ElementType.Fire);
    return dict;
  }

  addEffects(value?: number) {
    if (this.attacker.trait.toSymbol() === 'Bloodbourne') {
      if (this.type === AttackType.Brute) {
        for (const status of this.defender.statuses) {
          this.attacker.addStatus(status.copy());
        }
      }
    }
  }

  get attacker(): PlayerKaiScript {
    return this.state.getActiveKaiScript();
  }

  get defender(): PlayerKaiScript {
    return this.state.getTarget().getActiveKaiScript();
  }

  get hitChance(): number {
    return 100.0;
  }

  hitChanceFormula(attacker: PlayerKaiScript, defender: PlayerKaiScript): number {
    const aSpeed = attacker.totalLatency;
    const bSpeed = defender.totalLatency;
    const hitChance = this.adjustedHitChance;

    var chance = ((hitChance / 100) * (aSpeed / bSpeed) * 0.95);

    return Util.clamp(chance, 0, 100.0);
  }

  use(): void {

    const client = this.state.getClient();

    const chance = this.hitChanceFormula(this.attacker, this.defender);
    const test = Util.roll();

    console.log(`using ${this.name}, ${this.attacker.name}`);

    //Check if this is a passive attack
    if (this.isPassive) {
      if (this.baseCure > 0) {
        var cureAmount = 0;

        const cure = this.baseCure;
        cureAmount = this.attacker.incHealth(cure);

        client.attackEnded(this.passive({ type: EffectType.Cure, text: `${cureAmount}` }));
        this.addEffects(cureAmount);
      }
      else if (this.baseDamage > 0) {
        var damageAmount = 0;
        damageAmount = this.attacker.incHealth(this.baseDamage);

        client.attackEnded(this.passive({ type: EffectType.Damage, text: `${damageAmount}` }));
        this.addEffects(damageAmount);
      }
      else {
        client.attackEnded(this.passive());
        this.addEffects(0);
      }
    }
    //Check if defender is in a trick
    else if (this.defender.hasStatus('Burrow')) {
      client.attackEnded(this.react(AttackAccuracy.Miss));
    }
    else {

      //Check if this attack misses using calculated accuracy
      if (test > chance && this.toSymbol() !== 'FireLance') {
        client.attackEnded(this.react(AttackAccuracy.Miss));
      }

      //Check if the user is reflecting
      else if (this.defender.hasStatus('Reflect') && this.type === AttackType.Technical) {
        const target = this.state.getTarget();
        client.attackEnded(this.react(AttackAccuracy.Reflect));
        target.reflect(this);
      }

      //Attack always misses if decoy except firelance
      else if (this.defender.hasStatus('Decoy') && this.toSymbol() !== 'FireLance') {
        this.defender.findAndRemoveStatus('Decoy');
        client.attackEnded(this.react(AttackAccuracy.Miss));
      }

      else {
        //fire lance destroys decoys
        if (this.toSymbol() === 'FireLance') {
          this.defender.findAndRemoveStatus('Decoy');
        }

        var finalDamage = 0;        
        if (this.baseDamage === 0) {
          client.attackEnded(this.passive());
        }
        else {
          const playerDamage = new PlayerDamage(this.baseDamage, this, this.state, this.state.getTarget());

          const result = playerDamage
            .calculative()
            .elemental({
              potencies: this.potencies,
              weaknesses: this.weaknesses
            })
            .reactive({
              critRate: this.critRate,
              blockRate: this.blockRate,
              counterRate: this.counterRate
            })
            .combinative({
              combos: this.combos
            })
            .proc();

          const effects = this.damage(result.damage);

          this.state.getClient().attackEnded({
            potency: result.potency,
            isPassive: this.isPassive,
            fieldType: this.state.getTarget().getFieldType(),
            accuracy: result.accuracy,
            isCombo: result.isCombo,
            results: effects.messages,
            procs: result.procs,
            attacker: this.attacker.snapshot,
            defender: this.defender.snapshot
          });

          if (this.defender.isAlive() && result.accuracy === AttackAccuracy.Countered) {
            var counterModifier = 0.25;

            if (this.attacker.trait.toSymbol() === 'Redirection') {
              counterModifier = 0.35;
            }

            const counterDamage = Math.round(counterModifier * result.counterDamage);

            this.state.getTarget().getClient().attackReactionStarted({
              reaction: AttackReaction.Counter,
              isPassive: false,
              origin: {
                name: this.name,
                symbol: this.toSymbol()
              },
              time: 1.5
            });

            this.state.getTarget().startAnimation(1.5, this.counter.bind(this, counterDamage));
          }

          finalDamage = effects.damage;
        }

        if (this.defender.isAlive()) {
          this.state.triggerAttack();

          this.state.triggerHit();

          this.addEffects(finalDamage);
        }
      }
    }
  }

  passive(effect?: IEffect): IAttackResult {
    return {
      potency: null,
      fieldType: null,
      accuracy: AttackAccuracy.Normal,
      isCombo: false,
      results:
      effect ?
        [
          effect
        ]
        :
        []
      ,
      isPassive: this.isPassive,
      procs: null,
      attacker: this.attacker.snapshot,
      defender: this.defender.snapshot
    };
  }


  react(reaction: AttackAccuracy): IAttackResult {
    return {
      potency: null,
      fieldType: null,
      accuracy: reaction,
      isCombo: false,
      results: [],
      procs: null,
      isPassive: this.isPassive,
      attacker: this.attacker.snapshot,
      defender: this.defender.snapshot
    };
  }

 
  counter(damage: number): void {
    const attackerState = this.state;
    var defenderState = this.state.getTarget();

    const actualDamage = this.attacker.incHealth(-damage);
    defenderState.endAnimation();
    defenderState.getClient().attackReactionEnded({
      attacker: this.defender.snapshot,
      defender: this.attacker.snapshot,
      isPassive: false,
      result: {
        text: `${actualDamage}`,
        type: EffectType.Damage
      },
    })
    defenderState.update();

  }

  damage(damage: number): IDamageResult {

    const attacker = this.state.getActiveKaiScript();
    const score = this.state.score;
    const defenderPlayer = this.state.getTarget();
    const defender = this.defender;
    var finalDamage = (Math.round(damage));
    const bandwidthDamage = this.bandwidthDamage;
    var actualDamage = 0;
    var actualViralDamage = undefined;
    var actualBandwidthDamage = undefined;
    const effects: IEffect[] = [];

    actualDamage = defender.incHealth(-finalDamage);

    if (bandwidthDamage > 0) {
      actualBandwidthDamage = defenderPlayer.incBandwidth(bandwidthDamage);

      effects.push({
        text: `${actualBandwidthDamage}`,
        type: EffectType.Bandwidth
      });
    }

    defenderPlayer.setFieldType(this.elementType);

    score.addDamage(actualDamage, this.elementType)

    effects.push({
      text: `${actualDamage}`,
      type: EffectType.Damage
    });

    return {
      messages: effects,
      damage: actualDamage
    };

  }

  toSymbol(): string {
    return (<typeof Attack>this.constructor).toSymbol();
  }

  static toSymbol(): string {
    return 'MirrorFeather';
  }

}

export interface IStatusProcResult {
  damage: number,
  procs: number[]
}

export interface IAttackResult {
  attacker: {
    health: number
    totalHealth: number
    healthRatio: number
    viral: number
    totalViral: number
    isAlive: boolean
  }

  defender: {
    health: number
    totalHealth: number
    viral: number
    totalViral: number
    healthRatio: number
    isAlive: boolean
  }

  results: IEffect[]
  fieldType: ElementType
  accuracy: AttackAccuracy
  procs: number[]
  isPassive: boolean
  isCombo: boolean
  potency: AttackPotency
}

export interface IDamageResult {
  messages: IEffect[]
  damage: number
}