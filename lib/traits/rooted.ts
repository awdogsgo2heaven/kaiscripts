'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import SunGraze from '../attacks/sun-graze';

export default class Rooted extends Trait {

  static get name(): string {
    return 'Rooted';
  }

  static get desc(): string {
    return 'Draw energy from the ground'
  }

  static get attack(): typeof Attack {
    return SunGraze;
  }

  static toSymbol(): string {
    return 'Rooted';
  }

}
