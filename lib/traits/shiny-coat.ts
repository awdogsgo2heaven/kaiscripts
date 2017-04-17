'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import MirrorFeather from '../attacks/mirror-feather';

export default class ShinyCoat extends Trait {

  static get name(): string {
    return 'ShinyCoat';
  }

  static get desc(): string {
    return 'Draw energy from the ground'
  }

  static get attack(): typeof Attack {
    return MirrorFeather;
  }

  static toSymbol(): string {
    return 'ShinyCoat';
  }

}
