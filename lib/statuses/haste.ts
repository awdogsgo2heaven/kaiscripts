'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Haste extends Status {
  constructor(ticks) {
    super('Haste', ticks, 0)
  }
  static toSymbol(): string {
    return 'Haste';
  }
  get castRate(): number {
    return -0.5;
  }

  bandwidthTick(): number {
    return 1;
  }
}
