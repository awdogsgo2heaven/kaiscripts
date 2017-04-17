'use strict';

import Trait from '../traits/trait';
import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import Wildfire from '../attacks/wildfire';

export default class Firestarter extends Trait {

  static get name(): string {
    return 'Firestarter';
  }

  static get desc(): string {
    return 'If fire finishes the first combo it does double damage.'
  }

  static get attack(): typeof Attack {
    return Wildfire;
  }

  static toSymbol(): string {
    return 'Firestarter';
  }
}
