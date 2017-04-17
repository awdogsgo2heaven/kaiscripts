'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class SecurityUp extends Status {
  constructor(ticks, potency) {
    super('Security Up', ticks, potency)
  }
  static toSymbol(): string {
    return 'SecurityUp';
  }
  get bonus() {
    return {
      security: this.potency
    }
  }
}
