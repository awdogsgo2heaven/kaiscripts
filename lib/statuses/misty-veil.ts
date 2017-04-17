'use strict';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class MistyVeil extends Status {
  constructor(ticks) {
    super('Misty Veil', ticks, 0)
  }

  get hitChance(): number {
      return 0.25;
  }

  static toSymbol(): string {
    return 'MistyVeil';
  }
}
