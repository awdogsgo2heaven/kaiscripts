'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as Util from "../helpers";
import Item from '../items/item';
import {Account} from '../data/account';
import {AvatarItem} from '../data/avatar-item';
import {BattleEvent} from '../data/battle-event';
import {BattleResult} from '../data/battle-result';
import * as SocketIO from 'socket.io';
import {Battle, BattleOptions} from '../objects/battle';
import HumanPlayer from '../objects/human-player';
import ArtificialPlayer from '../objects/artificial-player';
import {PlayerOptions} from '../objects/player';
import * as events from 'events';
import * as Collections from 'typescript-collections';

interface IUserProperty {
  user: Account
}

const socketMocker = {
  join: function() { },
  emit: function() { },
  on: function() { },
  disconnect: function() { },
  removeAllListeners: function() { }
};
// Import events module
//const events = require('events');

class BattleService {
  public subscriber: events.EventEmitter;
  public battles: Collections.Dictionary<number, Battle>

  constructor() {
    // Create an eventEmitter object
    this.subscriber = new events.EventEmitter();
    this.subscriber.on('end', this.remove.bind(this));

    this.battles = new Collections.Dictionary<number, Battle>();
  }

  async disconnect(battle: Battle, player: HumanPlayer) {
    return battle.saveFinalState(
      new BattleResult(
        {
          status: battle.player.one === player? 'disconnect' : 'win',
          coins: 0,
          AvatarId: battle.player.one.avatar.id,
          time: battle.player.one.state.score.getTime(),
          totalDamage: battle.player.one.state.score.damage.totalDamage,
          isInfected: battle.player.one.state.isInfected(),
          points: 0,
          BattleEventId: battle.event.id
        }),
      new BattleResult(
        {
          status: battle.player.two === player? 'disconnect' : 'win',
          coins: 0,
          AvatarId: battle.player.two.avatar.id,
          time: battle.player.two.state.score.getTime(),
          totalDamage: battle.player.two.state.score.damage.totalDamage,
          isInfected: battle.player.two.state.isInfected(),
          points: 0,
          BattleEventId: battle.event.id
        })
      , true);
  }

  remove(battle: Battle) {
    this.battles.remove(battle.event.id);
  }


  /** Join a Battle Event **/
  join(eventId: number, user: Account, socket: SocketIO.Server) {
    var self = this;

    //check if battle can be found
    const battle = this.find(eventId);
    if (battle) {
      //check that player was invited to this battle and that their is an available slot to join
      if (battle.isInvited(user) && !battle.isFull()) {
        const nsp = socket.in(user.avatar.id.toString());
        if (battle.event.matchType === 'wild') {
          this.joinRandomBattle(user.avatar.id, battle, nsp);
          return true;
        }
      }
    }
    return false;
  }

  find(eventId: number) {
    const battle = this.battles.getValue(eventId);
    if (battle) {
      return battle;
    }
    else {
      throw new Error('Battle not found');
    }
  }

  private joinRandomBattle(avatarId: number, battle: Battle, socket: SocketIO.Namespace) {
    var self = this;
    const event = battle.event;
    const player = event.cache.players.find(x => x.avatar.id == avatarId);
    //create human player
    const defender = new HumanPlayer({
      id: 1,
      kaiScripts: player.kaiScripts,
      type: player.type,
      battleCache: player.battleCache,
      antiViralCount: player.antiViralCount,
      avatar: player.avatar,
      matchType: 'wild'
    }, socket);

    //join battle
    battle.join(defender);

    //if socket disconnects during battle 
    socket.on('disconnect', (socket) => {
      self.disconnect(battle, defender);
    });

  }

  createRandomBattle(event: BattleEvent, io: SocketIO.Server): Battle {
    const battle = new Battle({ event: event, publisher: this.subscriber }, io);

    const player = event.cache.players.find(x => x.avatar.id == -1);

    battle.join(new ArtificialPlayer({
      id: 2,
      kaiScripts: player.kaiScripts,
      type: player.type,
      antiViralCount: player.antiViralCount,
      battleCache: player.battleCache,
      avatar: player.avatar,
      matchType: 'wild'
    }, <any>socketMocker));

    battle.start();
    return this.add(event, battle);
  }

  add(event: BattleEvent, battle: Battle) {
    this.battles.setValue(event.id, battle);
    return battle;
  }

}

export const Battles = new BattleService();
