'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import Curse from '../attacks/curse';

export default class Haunt extends Trait {

  static get name(): string {
    return 'Haunt';
  }

  static get desc(): string {
    return 'Cuts the cost of swapping in half.'
  }

  static get attack(): typeof Attack {
    return Curse;
  }

  static toSymbol(): string {
    return 'Haunt';
  }

}
