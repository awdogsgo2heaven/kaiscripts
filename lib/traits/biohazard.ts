'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import ToxicSlick from '../attacks/toxic-slick';

export default class Biohazard extends Trait {

  static get name(): string {
    return 'Biohazard';
  }

  static get desc(): string {
    return 'Poisons do more damage.'
  }

  static get attack(): typeof Attack {
    return ToxicSlick;
  }

  static toSymbol(): string {
    return 'Biohazard';
  }

}
