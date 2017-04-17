'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class IntelligenceUp extends Status {
  constructor(ticks, potency) {
    super('Intelligence Up', ticks, potency)
  }
  static toSymbol(): string {
    return 'IntelligenceUp';
  }
  get bonus() {
    return {
      intelligence: this.potency
    }
  }
}
