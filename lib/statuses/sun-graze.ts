'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class SunGraze extends Status {
  constructor(ticks) {
    super('Sun Graze', ticks, 0)
  }
  static toSymbol(): string {
    return 'SunGraze';
  }
}
