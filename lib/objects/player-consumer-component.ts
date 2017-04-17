'use strict';

import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import PlayerComponent from './player-component';
import GamerTimer from './timer';
import * as shortid from 'shortid';
import * as Util from "../helpers";
import PlayerEmitter from './player-emitter';
import PlayerState from './player-state';

export default class PlayerConsumerComponent extends PlayerComponent {
  constructor(state: PlayerState, client: PlayerEmitter) {
    super(state, client);
  }

  useAntiViral(): void {
    const state = this.getState();
    const target = state.getTarget();
    const targetKaiScript = target.getActiveKaiScript();

    if (!state.isBusy() && targetKaiScript.viral === 0) {
      const Antidote = targetKaiScript.base.virus.antidote;
      const item = new Antidote(state, 'antidote');

      if (item) {
        if (item.isUsable()) {
          state.setActiveItem(item);

          state.startAnimation(1.0, this.finished.bind(this));

          this.getClient().itemUseStarted({
            item: item
          });

          state.getScore().addItem(item);
        }
        else {
          throw new Error("Item can no longer be used");
        }
      }
      else {
        throw new Error("Item does not exist");
      }
    }
  }
  use(position: number): void {
    const state = this.getState();

    if (!state.isBusy()) {

      const item = state.getItem(position);
      if (item) {
        if (item.isUsable()) {
          state.setActiveItem(item);

          state.startAnimation(1.0, this.finished.bind(this));

          this.getClient().itemUseStarted({
            item: item
          });
          state.getScore().addItem(item);
        }
        else {
          throw new Error("Item can no longer be used");
        }
      }
      else {
        throw new Error("Item does not exist");
      }
    }
  }

  finished(): void {

    try {
      const attacker = this.getState().getActiveKaiScript();
      const defender = this.getState().getTarget().getActiveKaiScript();

      this.getState().endAnimation();

      const item = this.getState().getActiveItem();

      const result = item.use();

      this.getClient().itemUseEnded({
        attacker: attacker.snapshot,
        defender: defender.snapshot,
        result: result,
        isInfected: defender.isInfected,
        isPassive: item.isPassive,
        used: item.used,
        id: item.clientId
      });
    }
    catch (e) {
      this.getState().error(e);

    }
  }
}
