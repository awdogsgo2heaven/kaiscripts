'use strict';

import * as _ from 'underscore';
import Status from '../statuses/status';
import {PlayerKaiScript} from '../objects/player-kai-script';
import {PlayerOptions} from './player';
import {ElementType} from '../helpers/common';

export default class PlayerScore {

  public damage = {
    totalDamage: 0,
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  public teamSize: number
  public lucky: boolean = true
  public startDateTime: number = null;
  public endDateTime: number = null;
  public avgLevel: number
  public victories: any
  public items: any
  public statusCounts: any
  public encounterCounts: any
  public contributors: PlayerKaiScript[]
  public points: number = 0;

  constructor(options: PlayerOptions) {
    var self = this;

    this.victories = {

    }

    this.teamSize = options.kaiScripts.length;

    this.items = {

    }

    this.lucky = true;
    this.statusCounts = {};
    this.encounterCounts = {};

    self.avgLevel = 0;
    self.contributors = [];
  }

  startTime(): void {
    this.startDateTime = Date.now();
  }

  finalize(): void {
    this.endDateTime = Date.now();
  }

  getPoints(): number {
    return this.points;
  }

  getTime(): number {
    this.finalize();
    return Math.abs((this.endDateTime - this.startDateTime)) / 1000.0;
  }

  addDamage(damage: number, elementType: ElementType): void {
    var self = this;
    self.damage.totalDamage += damage;
    self.addElementDamage(elementType, damage);
  }

  addLuck(isLucky: boolean): void {
    this.lucky = this.lucky && isLucky;
  }

  addElementDamage(element, damage) {
    var self = this;
    if (self.damage.hasOwnProperty(element)) {
      self.damage[element] += damage;
    }
  }

  get survivors() {
    return _.filter(this.contributors, (x) => x.health > 0);
  }

  addStatus(status: Status): void {
    if (status.name in this.statusCounts) {
      this.statusCounts[status.name] += 1;
    }
    else {
      this.statusCounts[status.name] = 1;
    }
  }

  addContributor(kaiScript: PlayerKaiScript): void {
    var contributor = _.find(this.contributors, (x) => x.clientId === kaiScript.clientId);

    if (!contributor) {
      this.contributors.push(kaiScript);
    }
  }

  addEncounter(kaiScript: PlayerKaiScript): void {
    if (kaiScript.clientId in this.encounterCounts) {
      this.encounterCounts[kaiScript.clientId] += 1;
    }
    else {
      this.encounterCounts[kaiScript.clientId] = 1;
    }
  }

  addItem(item): void {
    if (!item) {
      this.items[item.base.id] = this.items[item.base.id] || 0;
    }
  }

  removeContributor(kaiScriptId: number): void {
    var self = this;
    if (_.contains(self.contributors, { id: kaiScriptId })) {
      var index = _.indexOf(self.contributors, function(c) { c.id === kaiScriptId; });
      self.contributors.splice(index, 1);
    }
  }

  addVictory(defeated: PlayerKaiScript): void {
    if(!defeated.isInfected && defeated.virus) {
      this.points += defeated.virus.factionPoints;
    }
  }
}
