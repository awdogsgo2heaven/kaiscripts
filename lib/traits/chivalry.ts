'use strict';

import Trait from '../traits/trait';
import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import BraveMove from '../attacks/brave-move';

export default class Gutsy extends Trait {

  static get name(): string {
    return 'Chivalry';
  }

  static get desc(): string {
    return 'If fire finishes the first combo it does double damage.'
  }

  static get attack(): typeof Attack {
    return BraveMove;
  }

  static toSymbol(): string {
    return 'Chivalry';
  }

}
