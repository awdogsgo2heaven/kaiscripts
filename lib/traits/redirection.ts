'use strict';

import Trait from '../traits/trait';

import * as consts from '../config/constants';
import Attack from '../attacks/attack';
import HipThrow from '../attacks/hip-throw';

export default class Redirection extends Trait {

  static get name(): string {
    return 'Redirection';
  }

  static get desc(): string {
    return 'Increases damage countered.'
  }

  static get attack(): typeof Attack {
    return HipThrow;
  }

  static toSymbol(): string {
    return 'Redirection';
  }

}
