'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class SecurityUp extends Status {
  constructor(ticks, potency) {
    super('Attack Up', ticks, potency)
  }
  static toSymbol(): string {
    return 'AttackUp';
  }
  get bonus() {
    return {
      attack: this.potency
    }
  }
}
