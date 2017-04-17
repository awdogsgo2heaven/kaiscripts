'use strict';

import PlayerComponent from './player-component';
import GameTimer from './timer';
import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import * as Util from "../helpers";
import * as shortid from 'shortid';
import Attack from '../attacks/attack';
import PlayerEmitter from './player-emitter';
import PlayerState from './player-state';
import {IAttackAction} from './player-attacker-component';

import {NotImplementedError} from '../errors';

export default class PlayerCasterComponent extends PlayerComponent {
  constructor(state: PlayerState, client: PlayerEmitter) {
    super(state, client);
  }

  cancel(): void {
    var self = this;
    if (self.getState().isCasting) {
      var timer = self.getState().getCastingTimer();
      timer.pause();
      self.getState().setCastingTimer(null);
      self.getState().setIsCasting(false);
    }

    self.getClient().castingCanceled();
  }

  reflect(attack: Attack, callback: IAttackAction): void {
    var state = this.getState();

    state.setCastingTimer(null);
    this.getClient().castingCanceled();

    this.getState().setActiveAttack(attack);
    this.getState().queue('Attack', attack);

    this.getState().setIsCasting(true);
    //if (!isOverloaded) {
    this.startCasting(callback);
  }
  cast(position: number, callback: IAttackAction): void {

    const state = this.getState();
    const castState = { position: position }
    if (!state.isBusy() && state.triggerTryCast(castState)) {

      var kaiScript = this.getState().getActiveKaiScript();
      var isFrozen = kaiScript.hasStatus('Frozen');

      if (!isFrozen) {

        var attacks = this.getState().getActiveAttacks();

        var attack = attacks[castState.position - 1];

        if (attack) {
          var isOverloaded = this._setActiveAttack(attack);
          this.startCasting(callback);
        }
      }
    }
  }

  _setActiveAttack(attack: Attack): boolean {

    //set active attack
    this.getState().setActiveAttack(attack);
    this.getState().queue('Attack', attack);

    //adjust bandwidth on attack cost
    this.getState().incBandwidth(attack.adjustedCost);

    this.getState().setIsCasting(true);

    return false;

  }

  startCasting(callback: IAttackAction): void {
    var state = this.getState();
    var target = state.getTarget();

    var kaiScript = state.getActiveKaiScript();

    for(const status of kaiScript.statuses) {
      status.triggerCast();
    }
    
    var activeAttack = state.getActiveAttack();
    //var hits = activeAttack.hitCount || 0;
    const castTime = activeAttack.adjustedCastTime || 1.0;

    state.setCastingTimer(new GameTimer(castTime * 1000, this.finishedCasting.bind(this, callback)));

    if (!target.isAnimating) {
      state.startCastingTimer();
    }

    target.unlock();

    this.getClient().castingStarted({
      t: castTime,
      b: state.getBandwidth()
    });
  }

  finishedCasting(finished: IAttackAction): void {
    console.log('finished casting')
    try {
      const state = this.getState();
      const target = state.getTarget();
      //Check to see if Player is still Casting, if not, the Attack
      //was canceled or interrupted so we don't need to do anything
      if (state.isCasting) {

        this.getClient().castingEnded();

        //Casting is complete
        state.setIsCasting(false);

        const activeAttack = state.getActiveAttack();
        const animationTime = activeAttack.animationTime || 2.0;

        this.getClient().attackStarted({
          name: activeAttack.name,
          t: animationTime,
          isPassive: activeAttack.isPassive
        });

        state.startAnimation(animationTime, finished);
      } else {
        this.getClient().castingCanceled();
      }
    }
    catch (e) {
      this.getState().error(e);
    }
  }
}
