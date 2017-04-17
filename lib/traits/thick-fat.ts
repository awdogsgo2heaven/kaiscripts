'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import Rollout from '../attacks/rollout';

export default class ThickFat extends Trait {

  static get name(): string {
    return 'Thick Fat';
  }

  static get desc(): string {
    return 'Immune to virus.'
  }

  static get attack(): typeof Attack {
    return Rollout;
  }

  static toSymbol(): string {
    return 'ThickFat';
  }

}
