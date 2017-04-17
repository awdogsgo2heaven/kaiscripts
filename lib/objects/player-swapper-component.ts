'use strict';

import PlayerComponent from './player-component';
import GameTimer from './timer';
import PlayerEmitter from './player-emitter';
import PlayerState from './player-state';
import {AvatarKaiScript} from '../data/avatar-kai-script';

export default class PlayerSwapperComponent extends PlayerComponent {
  constructor(state: PlayerState, client: PlayerEmitter) {
    super(state, client);
  }

  /** Switch to next living KaiScript **/
  next(): void {
    if (!this.getState().isCasting && !this.getState().isAnimating) {
      var iterator = this.getState().kaiScripts;
      for (var i = 0; i < 5; i++) {
        var kaiScript = iterator.next();
        if (kaiScript.isAlive()) {
          this._swapKaiScript(iterator.current);
          return;
        }
      }
    }
  }

  commit(): void {
    if (this.getState().isWaiting()) {
      var kaiScript = this.getState().getActiveKaiScript();
      this.getState().setIsWaiting(false);
      this.restartStatusTimers();
    }
  }

  swap(direction, forceCommit = false) {
    var iterator = this.getState().kaiScripts;
    for (var i = 0; i < 5; i++) {
      var kaiScript = direction > 0 ? iterator.next() : iterator.previous();
      if (kaiScript.isAlive()) {
        this._hotSwap(iterator.current, forceCommit);
        return;
      }
    }
  }

  _hotSwap(position: number, forceCommit: boolean): void {
    const state = this.getState();
    const kaiScript = state.getActiveKaiScript();

    if (!state.isDead && !forceCommit) {

      if (kaiScript.trait.toSymbol() === 'Hyper') {
        state.incBandwidth(15.0);
      }
      else {
        state.incBandwidth(30.0);
      }

      //update client bandwidth
      this.getClient().bandwidth(state.bandwidth);

      if (!kaiScript.hasStatus('Frozen')) {
        this._startHotSwap(position, false);
      } 
    } else {
      this._startHotSwap(position, forceCommit);
    }
  };

  _startHotSwap(position: number, forceCommit: boolean): void {
    this.getState().setIsAnimating(true);

    var timer = new GameTimer(0.25 * 1000,
      this._finishHotSwap.bind(this, position, forceCommit
      ));
    this.getState().setCastingTimer(timer);

    this.getState().getCastingTimer().resume();
  };

  _finishHotSwap(position: number, forceCommit: boolean): void {
    var self = this;
    try {
      self._swapKaiScript(position);
      self.getState().setIsAnimating(false);
      if (forceCommit) {
        this.commit();
      }
    }
    catch (e) {
      this.getState().error(e);
    }
  };


  _swapKaiScript(position: number): boolean {
    var isTrapped = false;

    if (this.getState().activeKaiScriptId) {
      var kaiScript = this.getState().getActiveKaiScript();

      if(kaiScript.isAlive()) {
        isTrapped = kaiScript.hasStatus('Frozen') || kaiScript.isTrapped();
      }
    }

    if (!isTrapped) {
      var nextKaiScript = this.getState().getKaiScript(position);
      console.log(nextKaiScript);
      if (nextKaiScript) {
        this.getState().getScore().addContributor(nextKaiScript);
        this.getState().queue('Swap', nextKaiScript);
        this.getState().getTarget().getScore().addEncounter(nextKaiScript);
        this.getState().setActiveKaiScript(nextKaiScript);
        this.restartStatusTimers();
        this.getClient().swapped(nextKaiScript);
      } else {
        throw new Error('No KaiScript at that position');
      }
      return true;
    }
    return false;
  };

  restartStatusTimers(): void {
    var state = this.getState();
    state.startStatuses();
    state.getTarget().startStatuses();
  };
}
