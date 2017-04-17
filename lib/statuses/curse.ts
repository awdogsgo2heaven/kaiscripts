'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Curse extends Status {
  constructor(ticks, potency) {
    super('Curse', ticks, potency)
  }
  static toSymbol(): string {
    return 'Curse';
  }
}
