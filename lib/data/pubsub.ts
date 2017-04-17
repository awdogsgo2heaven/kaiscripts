import {logger} from '../../lib/helpers/logger';
import * as consts from '../../lib/config/constants';
import * as _ from 'underscore';
import {KaiScriptService} from '../../lib/services/kai-scripts';
import {LocatorService} from '../../lib/services/locator';
import {Battles} from '../../lib/services/battle';
import {BadRequestError, NotFoundError} from '../../lib/errors';
import * as SocketIO from 'socket.io';
import {Account} from '../../lib/data/account';
import {BattleEvent} from '../../lib/data/battle-event';
import * as redis from '../../lib/data/redis';
import * as Collections from 'typescript-collections';

interface ISubscriber {
  subscribe<T>(channel: string): Promise<T>
  unsubscribe<T>(channel: string): Promise<T>

  on(event: string, delegate: Function)
}

interface IPublisher {
  publish<T>(channel: string, data: string): Promise<T>
  set(key: string, value: string): Promise<number>
  get(key: string): Promise<string>

}

class RedisPubSub {

  public subscriber: ISubscriber = redis.server;
  public publisher: IPublisher = redis.client;
  public events: Collections.Dictionary<string, Function>
  public sockets: Collections.Dictionary<string, SocketIO.Socket>

  constructor() {
    this.events = new Collections.Dictionary<string, Function>();
    this.sockets = new Collections.Dictionary<string, SocketIO.Socket>();
    this.subscriber.on('message', this.onevent.bind(this));
  }

  async join(id: number, socket: SocketIO.Socket) {
    const key = redis.key('rooms', id);
    const occupant = await this.publisher.get(key);
    if (occupant) {
      await this.tryKick(occupant);
    }
    this.addListener('rooms', 'kick', socket.id, this.kick.bind(this, socket.id));
    socket.join(id.toString());
    this.sockets.setValue(socket.id, socket);
    return this.publisher.set(redis.key('rooms', id), socket.id);
  }

  leave(id: string) {
    this.sockets.remove(id);
    return this.removeListener('rooms', 'kick', id);
  }

  async kick(id: string) {
    const socket = this.sockets.getValue(id);
    if (socket) {
      socket.disconnect();
    }
    this.leave(id);
  }

  async tryKick(id: string) {
    const socket = this.sockets.getValue(id);
    if (socket) {
      socket.disconnect();
    }
    else {
      await this.publisher.publish(redis.key('rooms', 'kick', id), '');
    }
    return this.leave(id);
  }

  onevent(channel: string, data: string) {
    const event = this.events.getValue(channel);
    if (event) {
      if (data !== '') {
        event(...JSON.parse(data));
      }
      else {
        event();
      }
    }
  }

  addListener(nsp: string, event: string, id: string | number, delegate: Function) {
    const key = redis.key(nsp, event, id);
    this.events.setValue(key, delegate);
    this.subscriber.subscribe(key);
  }

  forward(nsp: string, event: string, id: number | string, socket: SocketIO.Socket) {
    var self = this;
    socket.on(event, (...args) => {
      self.publisher.publish(redis.key(nsp, event, id), JSON.stringify(args));
    });
  }

  removeListener(nsp: string, event: string, id: string | number) {
    const key = redis.key(nsp, event, id);
    this.events.remove(key);
    return this.subscriber.unsubscribe(key);
  }

}

export const PubSub = new RedisPubSub();
