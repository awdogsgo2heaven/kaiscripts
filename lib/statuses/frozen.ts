'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Frozen extends Status {
  constructor(ticks) {
    super('Frozen', ticks, 0)
  }
  static toSymbol(): string {
    return 'Frozen';
  }
}
