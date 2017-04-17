'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Decoy extends Status {
  constructor(ticks) {
    super('Decoy', ticks, 0)
  }
  static toSymbol(): string {
    return 'Decoy';
  }
  
  get isTrick() {
    return true;
  }

  get effect() {
    return {
      castTime: 1.5
    }
  }
}
