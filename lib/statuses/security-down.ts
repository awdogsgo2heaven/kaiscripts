'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class SecurityDown extends Status {
  constructor(ticks, potency) {
    super('Security Down', ticks, potency)
  }
  static toSymbol(): string {
    return 'SecurityDown';
  }
  get bonus() {
    return {
      security: this.potency
    }
  }
}
