'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class MaxHealthUp extends Status {
  constructor(ticks, potency) {
    super('Max Health Up', ticks, potency)
  }
  static toSymbol(): string {
    return 'MaxHealthUp';
  }
  get maxStack(): number {
    return 3;
  }

  get bonus() {
    return {
      resiliency: this.potency
    }
  }
}
