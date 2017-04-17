'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import Revenge from '../attacks/revenge';

export default class VengefulSpirit extends Trait {

  static get name(): string {
    return 'Vengeful Spirit';
  }

  static get desc(): string {
    return 'Immune to virus.'
  }

  static get attack(): typeof Attack {
    return Revenge;
  }

  static toSymbol(): string {
    return 'VengefulSpirit';
  }

}
