'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import Explosion from '../attacks/explosion';

export default class Hyperthermia extends Trait {

  static get name(): string {
    return 'Hyperthermia';
  }

  static get desc(): string {
    return 'Increases fire damage.'
  }

  static get attack(): typeof Attack {
    return Explosion;
  }

  static toSymbol(): string {
    return 'Hyperthermia';
  }

}
