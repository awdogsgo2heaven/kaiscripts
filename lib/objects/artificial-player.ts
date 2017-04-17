'use strict';

import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import * as Util from "../helpers";
import * as shortid from 'shortid';
import Player from './player';
import Attack from '../attacks/attack';

export default class ArtificialPlayer extends Player {

  private thinkInterval: number;
  private attackThought: Attack = null;

  bindEvents(): void {
    //self.socket.emit('id', self.id);
    this.thinkInterval = setInterval(this.think.bind(this), 1000, this);
  }

  unbindEvents(): void {
    clearInterval(this.thinkInterval);
    this.removeTarget();
  }

  think(): void {
    var attacks = this.getState().getActiveAttacks();
    var attack = _.sample(attacks);
    if (this.attackThought === null) {
      this.attackThought = attack;
    }
    else {
      var bandwidth = this.getState().getBandwidth();
      var cost = this.attackThought.adjustedCost;
      var isAffordable = (bandwidth + cost) < 100;
      if (!this.getState().isCasting && isAffordable) {
        this.serverSetAttack(this.attackThought.order);
        this.attackThought = null;
      }
    }
  }
}
