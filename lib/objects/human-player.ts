'use strict';

import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import * as Util from "../helpers";
import * as shortid from 'shortid';
import Player from './player';
import {PubSub} from '../data/pubsub';

export const COMMANDS = {
  JOIN: 'join',
  PING: 'z',
  QUIT: 'q',
  ITEM: 'i',
  SWITCH: 'switch',
  HOT_SWAP: 'hot',
  ATTACK: 'attack',
  CANCEL: 'cancel'
}
export default class HumanPlayer extends Player {

  bindEvents() {

    PubSub.addListener('BATTLE', COMMANDS.PING, this.avatar.id, this.endPing.bind(this));
    PubSub.addListener('BATTLE', COMMANDS.QUIT, this.avatar.id, this.serverQuit.bind(this));
    PubSub.addListener('BATTLE', COMMANDS.ITEM, this.avatar.id, this.serverUseItem.bind(this));
    PubSub.addListener('BATTLE', COMMANDS.SWITCH, this.avatar.id, this.serverCommit.bind(this));
    PubSub.addListener('BATTLE', COMMANDS.HOT_SWAP, this.avatar.id, this.serverHotSwap.bind(this));
    PubSub.addListener('BATTLE', COMMANDS.ATTACK, this.avatar.id, this.serverSetAttack.bind(this));
    PubSub.addListener('BATTLE', COMMANDS.CANCEL, this.avatar.id, this.serverCancelAttack.bind(this));

  }

  unbindEvents() {
    PubSub.removeListener('BATTLE', COMMANDS.PING, this.avatar.id);
    PubSub.removeListener('BATTLE', COMMANDS.ITEM, this.avatar.id);
    PubSub.removeListener('BATTLE', COMMANDS.QUIT, this.avatar.id);
    PubSub.removeListener('BATTLE', COMMANDS.SWITCH, this.avatar.id);
    PubSub.removeListener('BATTLE', COMMANDS.HOT_SWAP, this.avatar.id);
    PubSub.removeListener('BATTLE', COMMANDS.ATTACK, this.avatar.id);
    PubSub.removeListener('BATTLE', COMMANDS.CANCEL, this.avatar.id);
    this.removeTarget();
  }
}
