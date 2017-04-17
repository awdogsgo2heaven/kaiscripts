'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import Flash from '../attacks/flash';

export default class Startler extends Trait {

  static get name(): string {
    return 'Startler';
  }

  static get desc(): string {
    return 'First stun always lands.'
  }

  static get attack(): typeof Attack {
    return Flash;
  }

  static toSymbol(): string {
    return 'Startler';
  }

}
