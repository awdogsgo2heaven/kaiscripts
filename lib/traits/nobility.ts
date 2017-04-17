'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import SilkSpin from '../attacks/silk-spin';

export default class Nobility extends Trait {

  static get name(): string {
    return 'Nobility';
  }

  static get desc(): string {
    return 'Increases money gain after battle'
  }

  static get attack(): typeof Attack {
    return SilkSpin;
  }

  static toSymbol(): string {
    return 'Nobility';
  }

}
