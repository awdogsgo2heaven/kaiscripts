'use strict';
import PlayerState from './player-state';
import PlayerEmitter from './player-emitter';

export default class PlayerComponent {
  constructor(public state: PlayerState, public client: PlayerEmitter) {
  }
  public getClient(): PlayerEmitter {
    return this.client;
  }
  public getState(): PlayerState {
    return this.state;
  }
}
