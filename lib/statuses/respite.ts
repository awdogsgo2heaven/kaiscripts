'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';
import PlayerState from '../objects/player-state';
import {PlayerDamage} from '../objects/player-damage';

export default class Respite extends Status {

  constructor(ticks) {
    super('Respite', ticks, 0)
  }

  static toSymbol(): string {
    return 'Respite';
  }

  triggerDamage(playerDamage: PlayerDamage): boolean {
    playerDamage.damage = playerDamage.damage * -1;
    return true;
  }

}
