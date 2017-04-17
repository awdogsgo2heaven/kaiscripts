'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as Util from "../helpers";
import Attack from '../attacks/attack';
import Item from '../items/item';
import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import Status from '../statuses/status';
import * as bases from '../kai-scripts';
import * as Traits from '../traits';
import * as Attacks from '../attacks';
import * as Viruses from '../virus';
import * as validators from '../helpers/validators';
import {ValidationError, NotFoundError, BadRequestError} from '../errors';
import {AvatarKaiScriptAttack, IAvatarKaiScriptAttackSql} from './avatar-kai-script-attack';
import {AvatarItem, IAvatarItemSql} from './avatar-item';
import * as pg from 'pg-promise';
import db from './index';
import PlayerState from '../objects/player-state';


const sqlGetKaiScript = new pg.QueryFile('../lib/data/sql/getAvatarKaiScript.sql', {
  compress: true
});

const sqlCreateKaiScript = new pg.QueryFile('../lib/data/sql/createFusedKaiScript.sql', {
  compress: true
});

const sqlGetKaiScripts = new pg.QueryFile('../lib/data/sql/getKaiScripts.sql', {
  compress: true
});


const sqlGetKaiScriptCount = new pg.QueryFile('../lib/data/sql/getKaiScriptCount.sql', {
  compress: true
});


const sqlUnequipAll = new pg.QueryFile('../lib/data/sql/unequipAll.sql', {
  compress: true
});

const sqlParentKaiScript = new pg.QueryFile('../lib/data/sql/createParentKaiScript.sql', {
  compress: true
});

const sqlRenameKaiScript = new pg.QueryFile('../lib/data/sql/updateAvatarKaiScriptName.sql', {
  compress: true
});

const sqlSaveKaiScript = new pg.QueryFile('../lib/data/sql/updateAvatarKaiScriptHealth.sql', {
  compress: true
});

const sqlDestroyKaiScript = new pg.QueryFile('../lib/data/sql/destroyKaiScript.sql', {
  compress: true
});

export type Stat =
  "resiliency"
  | "security"
  | "attack"
  | "latency"
  | "intelligence"
  | "knowledge";


export class AvatarKaiScript {

  public statuses: Status[] = []
  public addBonus: ITempStat
  private multiBonus: ITempStat

  constructor(public data: IAvatarKaiScriptSql) {
    this.prepare();
  }

  get name(): string {
    return this.data.name;
  }

  get id(): number {
    return this.data.id;
  }

  set health(health) {
    this.data.health = health;
  }

  get health() {
    return this.data.health;
  }

  get isTeamMember(): boolean {
    return this.data.isTeamMember;
  }

  get teamOrder(): number {
    return this.data.teamOrder;
  }

  set teamOrder(order: number) {
    this.data.teamOrder = order;
  }

  get symbol(): string {
    return this.data.base;
  }

  get traitSymbol(): string {
    return this.data.trait;
  }

  get status(): string {
    return this.data.statuses[0];
  }

  get totalResiliency(): number {
    return this.getTotalStat('resiliency');
  }

  get totalSecurity(): number {
    return this.getTotalStat('security');
  }

  get totalLatency(): number {
    return this.getTotalStat('latency');
  }

  get totalAttack(): number {
    if (this.trait.toSymbol() === 'Gutsy') {
      return this.getTotalStat('attack') * 1.5;
    }
    return this.getTotalStat('attack')
  }

  get totalIntelligence(): number {
    if (this.trait.toSymbol() === 'Gutsy') {
      return this.getTotalStat('intelligence') * 1.5;
    }

    return this.getTotalStat('intelligence');
  }

  get totalKnowledge(): number {
    return this.getTotalStat('knowledge');
  }

  get healthRatio(): number {
    return Math.round((this.health / this.totalHealth) * 100.0) / 100.0;
  }

  get virus() {
    return Viruses[this.data.virus];
  }

  get totalViral(): number {
    const virus = this.virus;
    if (virus) {
      return virus.totalHealth;
    }
    return 0;
  }

  get totalHealth(): number {
    var total = this.totalResiliency * 1;
    return Math.floor(total);
  }

  get equipment(): AvatarItem[] {
    if (this.data.AvatarItems) {
      return this.data.AvatarItems.map(x => new AvatarItem(x));
    }
    return [];
  }

  get snapshot(): ISnapshot {
    return {
      health: this.health,
      totalHealth: this.totalHealth,
      healthRatio: this.healthRatio,
      viral: 0,
      totalViral: this.totalViral,
      isAlive: this.isAlive()
    }
  }

  get trait(): typeof Trait {
    const trait = Traits[this.data.trait];

    if (!trait) {
      throw new BadRequestError(`Trait with symbol ${this.data.trait} can not be found`);
    }

    return trait;
  }

  get base(): typeof KaiScript {
    const base = bases[this.data.base];

    if (!base) {
      throw new BadRequestError(`KaiScript with symbol ${this.data.trait} can not be found`);
    }

    return base;
  }

  prepare(): void {
    this.resetBonus();
    this.prepareEquipment();
  }

  resetBonus(): void {
    this.addBonus = {
      resiliency: 0.0,
      attack: 0.0,
      security: 0.0,
      latency: 0.0,
      knowledge: 0.0,
      intelligence: 0.0
    };
    this.multiBonus = {
      resiliency: 1.0,
      attack: 1.0,
      security: 1.0,
      latency: 1.0,
      knowledge: 1.0,
      intelligence: 1.0
    };
  }

  prepareEquipment(): void {
    var self = this;
    if (this.equipment) {
      for (var avatarItem of this.equipment) {
        avatarItem.item.equip(this);
        
      }
    }
  }

  updateStatMods(): void {
    this.resetBonus();
    this.prepareEquipment();
    for (var status of this.statuses) {
      const bonus = status.bonus;
      for (const attr in bonus) {
        const isProp = this.hasOwnProperty(attr);
        if (isProp) {
          this.multiBonus[attr] += bonus[attr];
        }
      }
    }
  }

  getTotalStat(stat: Stat): number {
    return (Util.clamp((this.getBaseStat(stat) * this.multiBonus[stat]) + this.addBonus[stat], 0, consts.MAX_STAT));
  }

  getBaseStat(stat: Stat): number {
    return consts.BaseStatsLookup[this.getBaseRank(stat)];
  }

  getBaseRank(stat): string {
    var base = this.base;
    return base.stats[stat];
  }

  get attacks(): typeof Attack[] {
    return this.data.attacks.map((data: string) => Attacks[data]);
  }

  getAttack(attack: string): typeof Attack {
    return this.attacks.find(function (a) { return a.toSymbol() === attack });
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  isTrapped(): boolean {

    if (this.trait.toSymbol() === 'Gutsy') {
      return true;
    }
    for (const status of this.statuses) {
      if (status.isTrapped) {
        return true;
      }
    }
    return false;
  }

  findStatus(status): Status {
    return _.find(this.statuses, function (x) {
      return x.name === status;
    });
  }

  pushStatus(status: Status): boolean {
    if (status) {
      if (this.trait.toSymbol() === 'ThickFat') {
        return false;
      }
      var existingStatus = this.findStatus(status.name);

      if (existingStatus) {
        existingStatus.merge(status);
      }
      else {
        this.statuses.push(status);
        return true;
      }
    }
    return false;
  }

  hasStatus(name: string): boolean {
    return this.findStatus(name) ? true : false;
  }

  async updateHeatlh() {
    return await db().none(sqlSaveKaiScript, {
      avatarId: this.data.AvatarId,
      id: this.id,
      health: this.health,
      statuses: JSON.stringify(this.statuses)
    });
  }

  incHealth(offset: number): number {

    const healthNow = this.health;
    const newHealth = Util.clamp(healthNow + offset, 0, this.totalHealth);
    this.health = newHealth;
    return Math.abs(healthNow - this.health);
  }



  async parent() {
    var parent = await db().one(sqlParentKaiScript, {
      name: this.name,
      base: this.base.toSymbol()
    }) as { id: number };
    return parent.id;
  }

  unequipAll() {
    return db().none(sqlUnequipAll, { id: this.id });
  }

  destroy() {
    return AvatarKaiScript.destroy(this.data.AvatarId, this.id)
  }

  toJSON(): IAvatarKaiScriptSql {
    return this.data;
  }

  static async getKaiScripts(avatarId: number, search: string, page: number, size: number): Promise<IAvatarKaiScriptList> {
    var data = await db().manyOrNone(sqlGetKaiScripts, {
      avatarId: avatarId,
      search: search,
      limit: size,
      offset: page * size
    }) as IAvatarKaiScriptSql[];
    if (data.length > 0) {
      var kaiScript = _.first(data);
      return {
        count: parseInt(kaiScript.fullCount) || 0,
        rows: data.map((datum) => new AvatarKaiScript(datum))
      }
    }
    return {
      count: 0,
      rows: []
    }
  }

  static async getKaiScriptByAvatar(avatarId: number, kaiScriptId: number): Promise<AvatarKaiScript> {
    var kaiScript = await db().oneOrNone(sqlGetKaiScript, {
      avatarId: avatarId,
      id: kaiScriptId
    }) as IAvatarKaiScriptSql;
    if (kaiScript) {
      return new AvatarKaiScript(kaiScript);
    }
    else {
      throw new NotFoundError();
    }
  }

  static async rename(avatarId: number, kaiScriptId: number, newName: string) {

    validators.required('Name', newName);
    validators.length(newName, 10);
    validators.profanity(newName);
    validators.spaces(newName);

    return db().none(sqlRenameKaiScript, { avatarId: avatarId, id: kaiScriptId, newName: newName });
  }

  static destroy(avatarId: number, kaiScriptId: number) {
    return db().none(sqlDestroyKaiScript, { avatarId: avatarId, id: kaiScriptId });
  }

  static async getKaiScriptCount(avatarId: number): Promise<number> {
    type IKaiScriptCount = { count: string };
    var counts = await db().oneOrNone(sqlGetKaiScriptCount, { avatarId: avatarId }) as IKaiScriptCount;
    if (counts != null) {
      return parseInt(counts.count || '0');
    } 
    return 0;
  }

  static async isMaxed(avatarId: number) {
    var counts = await this.getKaiScriptCount(avatarId);

    if (counts >= 99) {
      return true;
    }
    return false;
  }

  static async create(avatarId: number, name: string, base: string, trait: string, attacks: string[], parent1: number = null, parent2: number = null) {
    validators.required('Name', name);
    validators.length(name, 10);
    validators.profanity(name);
    validators.spaces(name);

    const newKaiScript = new AvatarKaiScript({
      name: name,
      base: base,
      trait: trait,
      AvatarId: avatarId,
      attacks: attacks
    });

    const data = await db().one(sqlCreateKaiScript, {
      name: name,
      base: base,
      health: newKaiScript.totalHealth,
      trait: trait,
      avatarId: avatarId,
      attacks: attacks,
      parent1: parent1,
      parent2: parent2
    }) as IAvatarKaiScriptSql;

    return new AvatarKaiScript(data);
  }

}

interface ITempStat {
  resiliency: number
  security: number
  attack: number
  latency: number
  intelligence: number
  knowledge: number
}

export interface IAvatarKaiScriptList {
  rows: AvatarKaiScript[]
  count: number
}

export interface ISnapshot {
  health: number
  totalHealth: number
  healthRatio: number
  viral: number
  totalViral: number
  isAlive: boolean
}
export interface IAvatarKaiScriptSql {
  id?: number
  name: string
  health?: number
  experiencePoints?: number
  isTeamMember?: boolean
  teamOrder?: number
  base: string
  trait: string
  virus?: string
  statuses?: any[]
  AvatarId?: number
  attacks?: string[]
  AvatarKaiScriptAttacks?: IAvatarKaiScriptAttackSql[]
  AvatarItems?: IAvatarItemSql[]
}
