'use strict';

import * as _ from 'underscore';

import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class Corruption extends Status {

  public sample = _.shuffle([0, 1, 2, 3])

  constructor(ticks: number) {
    super('Corruption', ticks, 0)
  }
  static toSymbol(): string {
    return 'Corruption';
  }

  triggerTryCast(state: { position: number }): boolean {
    state.position = this.sample[state.position - 1];
    return true;
  }

}
