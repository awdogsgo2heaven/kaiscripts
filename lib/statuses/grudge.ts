'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Grudge extends Status {
  constructor(ticks) {
    super('Grudge', ticks, 0)
  }
  static toSymbol(): string {
    return 'Grudge';
  }
}
