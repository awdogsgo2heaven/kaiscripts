'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import BloodHunger from '../attacks/blood-hunger';

export default class Bloodbourne extends Trait {

  static get name(): string {
    return 'Bloodbourne';
  }

  static get desc(): string {
    return 'Enemy status effects are contagious'
  }

  static get attack(): typeof Attack {
    return BloodHunger;
  }

  static toSymbol(): string {
    return 'Bloodbourne';
  }

}
