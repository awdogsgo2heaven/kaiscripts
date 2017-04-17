'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import AdrenalineRush from '../attacks/adrenaline-rush';

export default class Hyper extends Trait {

  static get name(): string {
    return 'Hyper';
  }

  static get desc(): string {
    return 'Cuts the cost of swapping in half.'
  }

  static get attack(): typeof Attack {
    return AdrenalineRush;
  }

  static toSymbol(): string {
    return 'Hyper';
  }

}
