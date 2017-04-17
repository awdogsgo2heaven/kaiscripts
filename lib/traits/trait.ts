'use strict';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';

export default class Trait {

  static get name(): string {
    return 'Unknown';
  }

  static get desc(): string {
    return 'System Error'
  }

  static get attack(): typeof Attack {
    return Attack;
  }

  static toSymbol(): string {
    return '';
  }

}
