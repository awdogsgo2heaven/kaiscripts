'use strict';

import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import * as Util from "../helpers";
import Attack from '../attacks/attack';
import Trait from '../traits/trait';
import base from '../kai-scripts/kai-script';
import Status from '../statuses/status';
import * as bases from '../kai-scripts';
import * as Traits from '../traits';
import {ValidationError, NotFoundError} from '../errors';
import * as Attacks from '../attacks';

export class AvatarKaiScriptAttack {
  constructor(public data: IAvatarKaiScriptAttackSql) {

  }

  get order(): number {
    return this.data.order;
  }

  get attack(): typeof Attack {
    var attack = Attacks[this.data.attack];
    if(attack) {
      return attack;
    }
    else {
      throw new Error('No Attack found for ' + this.data.attack);
    }
  }

}

export interface IAvatarKaiScriptAttackSql {
  id: number
  order: number
  attack: string
}
