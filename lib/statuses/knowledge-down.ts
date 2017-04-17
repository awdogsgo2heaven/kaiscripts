'use strict';


import Status from '../statuses/status';
import * as consts from '../config/constants';

export default class KnowledgeDown extends Status {
  constructor(ticks, potency) {
    super('Knowledge Down', ticks, potency)
  }
  static toSymbol(): string {
    return 'KnowledgeDown';
  }
  get bonus() {
    return {
      knowledge: this.potency
    }
  }
}
