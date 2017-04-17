'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Reflect extends Status {
  constructor(ticks) {
    super('Reflect', ticks, 0)
  }
  static toSymbol(): string {
    return 'Reflect';
  }
}
