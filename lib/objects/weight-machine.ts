'use strict';

import * as _ from 'underscore';
import * as Util from "../helpers";

type WeightedChoice = {
  weight: number
  option: any
}
export default class WeightMachine {

  constructor(public choices: WeightedChoice[]) {
    var self = this;
  }
  pickOne() {
    var chance = 0.0;

    for (const choice of this.choices) {
      chance += choice.weight * 100;
    }

    const rand = Util.rand(0, chance);
    chance = 0.0;
    for (const choice of this.choices) {
      var nextChance = chance + choice.weight * 100;
      if (rand >= chance && rand <= nextChance) {
        return choice.option;
      }
      chance = nextChance;
    }
    return null;
  }
}
