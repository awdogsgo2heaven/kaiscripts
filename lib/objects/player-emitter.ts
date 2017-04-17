'use strict';

import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import * as Util from "../helpers";
import * as shortid from 'shortid';
import * as SocketIO from 'socket.io';
import Player from './player';
import Attack, {IAttackResult} from '../attacks/attack';
import {IQueueAction, IReflectAction, IVictoryAction} from './battle';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import Status from '../statuses/status';
import {NotImplementedError} from '../errors';
import {PlayerOptions} from './player';

export const MESSAGES = {
  SWAP: 'SWAP',
  BANDWIDTH: 'BANDWIDTH',
  ITEM_USE_STARTED: 'ITEM_USE_STARTED',
  ITEM_USE_ENDED: 'ITEM_USE_ENDED',
  LOCKED: 'LOCKED',
  DEATH: 'DEATH',
  UNLOCKED: 'UNLOCKED',
  ADD_STATUS: 'ADD_STATUS',
  REMOVE_STATUS: 'REMOVE_STATUS',
  UPDATE_STATUS: 'UPDATE_STATUS',
  CASTING_STARTED: 'CASTING_STARTED',
  CASTING_ENDED: 'CASTING_ENDED',
  CASTING_CANCELED: 'CASTING_CANCELED',
  ATTACK_STARTED: 'ATTACK_STARTED',
  ATTACK_ENDED: 'ATTACK_ENDED',
  ATTACK_REACTION_STARTED: 'ATTACK_REACTION_STARTED',
  ATTACK_REACTION_ENDED: 'ATTACK_REACTION_ENDED',
  END: 'END'
};

interface IListener {
  _id: number
  socket: SocketIO.Namespace
}


export default class PlayerEmitter {

  listeners: IListener[]
  public victory: IVictoryAction;
  public id: number;

  constructor(public options: PlayerOptions, public socket: SocketIO.Namespace) {
    this.listeners = [{ socket: this.socket, _id: options.id }];
    this.id = options.id;
    //socket binds

  }

  setVictoryAction(callback: IVictoryAction): void {
    this.victory = callback;
  }

  finish(isWinner: boolean): void {
    this.socket.emit(MESSAGES.END, isWinner);
  }

  sendInfo(battleCache, eventId: number, antiViralCount: number): void {
    function serialize(items) {
      var schema = _.map(items, function(item, index) {
        return {
          name: item.name,
          usage: item.usage,
          id: item.clientId,
        }
      });
      return schema;
    }

    this.socket.emit('id', {
      id: this.id,
      eventId: eventId,
      cache: serialize(battleCache),
      antiViralCount: antiViralCount
    });
  }

  getListeners() {
    return this.listeners;
  }

  addListeners(player: Player): void {
    this.listeners.push(
      {
        socket: player.getClient().socket,
        _id: player.getClient().id
      });
  }

  castingStarted(info): void {
    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.CASTING_STARTED,
        {
          id: self.id,
          time: info.t,
          bandwidth: Math.floor(info.b)
        });
    });
  }

  castingEnded(): void {
    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.CASTING_ENDED, self.id);
    });
  }


  locked(locked: boolean): void {
    var self = this;
    if (locked) {
      self.socket.emit(MESSAGES.LOCKED, consts.LOCK_TIME);
    } else {
      self.socket.emit(MESSAGES.UNLOCKED, consts.LOCK_TIME);
    }
  }

  castingCanceled(): void {
    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.CASTING_CANCELED, self.id);
    });
  }

  attackStarted(info): void {
    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.ATTACK_STARTED,
        {
          id: self.id,
          attack: info.name,
          time: info.t,
          self: info.isPassive
        });
    });
  }

  attackReactionStarted(info: { reaction: number, time: number, isPassive: boolean, origin: { name: string, symbol: string } }): void {
    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.ATTACK_REACTION_STARTED,
        {
          id: self.id,
          reaction: info.reaction,
          isPassive: info.isPassive,
          origin: info.origin,
          time: info.time
        });
    });
  }

  itemUseStarted(info): void {
    var self = this;
    console.log(info);
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.ITEM_USE_STARTED,
        {
          id: self.id,
          item: {
            id: info.item.clientId,
            name: info.item.name
          }
        });
    });
  }

  swapped(kaiScript): void {
    //serializes this controller method
    function serialize(kaiScript, showAttacks) {

      var schema = <any>{
        id: kaiScript.clientId,
        name: kaiScript.name,
        resource: kaiScript.base.name,
        health: kaiScript.healthRatio,
        statuses: kaiScript.statuses,
        viral: kaiScript.viral,
        totalViral: kaiScript.totalViral,
      }
      if (showAttacks) {
        var order = 0;
        schema.health = kaiScript.health;
        schema.totalHealth = kaiScript.totalHealth;
        schema.attacks = _.map(kaiScript.attacks, function(attack) {
          order++;
          return {
            name: attack.name,
            cost: attack.cost,
            elementType: attack.elementType,
            order: order,
            self: attack.isPassive
          }
        });
        schema.equipment = _.map(kaiScript.equipment, function (equipment) {
          return {
            name: equipment.name
          }
        });
      }
      return schema;
    }

    var self = this;
    self.getListeners().forEach(function(listener) {
      if (kaiScript._cached) {
        listener.socket.emit(MESSAGES.SWAP,
          {
            id: self.id,
            key: kaiScript.clientId
          });
      } else {
        listener.socket.emit(MESSAGES.SWAP,
          {
            id: self.id,
            target: serialize(kaiScript, (listener._id === self.id))
          });
      }

    });
    kaiScript._cached = true;
  }

  attackReactionEnded(info): void {
    //serializes this controller method
    
    function serialize(result, switcher) {
      var schema = <any>{
        result: result.result,
        isPassive: result.isPassive
      }

      if (switcher) {
        schema.attacker = {
          health: result.attacker.health,
          totalHealth: result.attacker.totalHealth,
          viral: result.attacker.viral,
          totalViral: result.attacker.totalViral
        }
        schema.defender = {
          health: result.defender.healthRatio,
          viral: result.defender.viral,
          totalViral: result.defender.totalViral
        }
      } else {
        schema.attacker = {
          health: result.attacker.healthRatio,
          viral: result.attacker.viral,
          totalViral: result.attacker.totalViral
        }
        schema.defender = {
          health: result.defender.health,
          totalHealth: result.defender.totalHealth,
          viral: result.defender.viral,
          totalViral: result.defender.totalViral
        }
      }
      schema.attacker.dead = !result.attacker.isAlive;
      schema.defender.dead = !result.defender.isAlive;
      return schema;
    }

    var self = this;


    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.ATTACK_REACTION_ENDED,
        {
          id: self.id,
          result: serialize(info, self.id === listener._id)
        });
    });
  }

  attackEnded(info: IAttackResult): void {
    //serializes this controller method
    function serialize(result: IAttackResult, switcher: boolean) {
      var schema = <any>{
        results: result.results,
        fieldType: result.fieldType,
        accuracy: result.accuracy,
        isCombo: result.isCombo,
        isPassive: result.isPassive,
        potency: result.potency,
        procs: result.procs,
      }
      if (switcher) {
        schema.attacker = {
          health: result.attacker.health,
          totalHealth: result.attacker.totalHealth,
          viral: result.attacker.viral,
          totalViral: result.attacker.totalViral
        }
        schema.defender = {
          health: result.defender.healthRatio,
          viral: result.defender.viral,
          totalViral: result.defender.totalViral 
        }
      } else {
        schema.attacker = {
          health: result.attacker.healthRatio,
          viral: result.attacker.viral,
          totalViral: result.attacker.totalViral
        }
        schema.defender = {
          health: result.defender.health,
          totalHealth: result.defender.totalHealth,
          viral: result.defender.viral,
          totalViral: result.defender.totalViral
        }
      }
      schema.attacker.dead = !result.attacker.isAlive;
      schema.defender.dead = !result.defender.isAlive;

      return schema;
    }

    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.ATTACK_ENDED,
        {
          id: self.id,
          result: serialize(info, self.id === listener._id)
        });
    });
  }

  itemUseEnded(info): void {
    //serializes this controller method
    function serialize(result, switcher: boolean) {
      var schema = <any>{
        result: result.result,
        used: result.used,
        isInfected: result.isInfected,
        isPassive: result.isPassive,
        id: result.id
      }
      if (switcher) {
        schema.attacker = {
          health: result.attacker.health,
          totalHealth: result.attacker.totalHealth,
          viral: result.attacker.viral,
          totalViral: result.attacker.totalViral
        }
        schema.defender = {
          health: result.defender.healthRatio,
          viral: result.defender.viral,
          totalViral: result.defender.totalViral
        }
      } else {
        schema.attacker = {
          health: result.attacker.healthRatio,
          viral: result.attacker.viral,
          totalViral: result.attacker.totalViral
        }
        schema.defender = {
          health: result.defender.health,
          totalHealth: result.defender.totalHealth,
          viral: result.defender.viral,
          totalViral: result.defender.totalViral
        }
      }
      schema.attacker.dead = !result.attacker.isAlive;
      schema.defender.dead = !result.defender.isAlive;
      
      return schema;
    }

    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.ITEM_USE_ENDED,
        {
          id: self.id,
          result: serialize(info, self.id === listener._id)
        });
    });
  }

  death(info): void {
    //serializes this controller method
    function serialize(result) {
      return result;
    }

    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.DEATH,
        {
          id: self.id,
          result: serialize(info)
        });
    });
  }


  bandwidth(bandwidth: number): void {
    var self = this;
    self.socket.emit(MESSAGES.BANDWIDTH, { b: Math.floor(bandwidth) });
  }

  addStatus(kaiScript: AvatarKaiScript, status: Status): void {
    //serializes this controller method
    function serialize(kaiScript, status: Status): {
      id: number,
      status: {
        id?: number 
        name?: string 
        ticks?: number
        text?: string
      }
    } {

      if(status) {
        return {
          id: kaiScript.clientId,
          status: {
            id: status.clientId,
            name: status.name,
            ticks: status.totalTicks,
            text: undefined
          }
        }
      }

      return {
          id: kaiScript.clientId,
          status: {
            id: undefined,
            name: undefined,
            ticks: undefined,
            text: 'No Effect'
          }
      }
    }
    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.ADD_STATUS,
        {
          id: self.id,
          target: serialize(kaiScript, status)
        });
    });
  }

  updateStatus(data: any, status: Status, effect): void {

    //serializes this controller method
    function serialize(result, status, effect, switcher) {
      var schema = <any>{
        id: result.clientId,
        status: {
          id: status.clientId,
          ticks: status.ticksLeft,
          effect: effect
        }
      }

      if (switcher) {
        schema.attacker = {
          health: result.attacker.health,
          totalHealth: result.attacker.totalHealth,
          viral: result.attacker.viral,
          totalViral: result.attacker.totalViral
        }
        schema.defender = {
          health: result.defender.healthRatio,
          viral: result.defender.viral,
          totalViral: result.defender.totalViral
        }
      } else {
        schema.attacker = {
          health: result.attacker.healthRatio,
          viral: result.attacker.viral,
          totalViral: result.attacker.totalViral
        }
        schema.defender = {
          health: result.defender.health,
          totalHealth: result.defender.totalHealth,
          viral: result.defender.viral,
          totalViral: result.defender.totalViral
        }
      }
      schema.attacker.dead = !result.attacker.isAlive;
      schema.defender.dead = !result.defender.isAlive;

      return schema;
    }
    
    var self = this;

    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.UPDATE_STATUS,
        {
          id: self.id,
          result: serialize(data, status, effect, self.id === listener._id)
        });
    });
  }

  removeStatus(kaiScript: AvatarKaiScript, status: Status): void {
    //serializes this controller method
    function serialize(kaiScript, status) {
      return {
        id: kaiScript.clientId,
        status: {
          id: status.clientId
        }
      }
    }
    var self = this;
    self.getListeners().forEach(function(listener) {
      listener.socket.emit(MESSAGES.REMOVE_STATUS,
        {
          id: self.id,
          target: serialize(kaiScript, status)
        });
    });
  }
}
