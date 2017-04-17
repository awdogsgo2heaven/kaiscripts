'use strict';


import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import {AvatarKaiScript} from '../data/avatar-kai-script';

import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';

export default class Revenge extends Attack {

  static get name(): string {
    return 'Revenge';
  }

  get baseDamage(): number {
    return 20.0 * this.state.getKaiScriptAliveCount();
  }

  static get type(): AttackType {
    return AttackType.Brute;
  }

  static get cost(): number {
    return 50.0;
  }

  static get castTime(): number {
    return 2.5;
  }

  get animationTime(): number {
    return 2.5;
  }

  static get elementType(): ElementType {
    return ElementType.Earth;
  }

  static toSymbol(): string {
    return 'Revenge';
  }

}
