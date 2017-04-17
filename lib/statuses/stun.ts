'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Stun extends Status {
  constructor(ticks) {
    super('Stun', ticks, 0)
  }
  static toSymbol(): string {
    return 'Stun';
  }
}
