'use strict';

import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import PlayerComponent from './player-component';
import PlayerState from './player-state';
import GamerTimer from './timer';
import * as Util from "../helpers";
import * as shortid from 'shortid';
import Attack, {IAttackResult} from '../attacks/attack';
import {NotImplementedError} from '../errors';
import WeightMachine from '../objects/weight-machine';
import PlayerEmitter from './player-emitter';
import Status from '../statuses/status';

export interface IAttackAction {
  (): void
}

export class PlayerAttackerComponent extends PlayerComponent {

  constructor(state: PlayerState, client: PlayerEmitter) {
    super(state, client);
  }

  attack(): void {
    //calculate result
    const state = this.getState();

    //finish animation

    state.endAnimation();

    this.useAttack();

    state.activeAttack = null;
    state.update();
  }

  useAttack(): void {
    const target = this.getState().getTarget();

    const attacker = this.getState().getActiveKaiScript();
    const defender = target.getActiveKaiScript();
    const attack = this.getState().getActiveAttack();

    attacker.updateStatMods();
    defender.updateStatMods();

    attack.use();


  }
}


