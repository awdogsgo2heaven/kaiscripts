'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import Mischief from '../attacks/mischief';

export default class Peddler extends Trait {

  static get name(): string {
    return 'Peddler';
  }

  static get desc(): string {
    return 'Increases potency of items.'
  }

  static get attack(): typeof Attack {
    return Mischief;
  }

  static toSymbol(): string {
    return 'Peddler';
  }
}
