'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import Boil from '../attacks/boil';

export default class Waterproof extends Trait {

  static get name(): string {
    return 'Waterproof';
  }

  static get desc(): string {
    return 'Draw energy from the ground'
  }

  static get attack(): typeof Attack {
    return Boil;
  }

  static toSymbol(): string {
    return 'Waterproof';
  }

}
