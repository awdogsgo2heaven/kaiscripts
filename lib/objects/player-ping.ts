'use strict';
import * as SocketIO from 'socket.io';

export default class PlayerPing {

  public ping: number
  public startPingTime: number

  constructor(public socket: SocketIO.Namespace) {
    this.startPingTime = null;
    this.ping = null;
  }

  startPing() {
    this.startPingTime = +Date.now();
    this.socket.emit('a');
  }

  endPing() {
    var endPing = +Date.now();
    this.setPing(endPing - this.startPingTime);
  }

  setPing(ping) {
    this.startPingTime = null;
    this.ping = ping;
  }

  getPing() {
    return this.ping;
  }
}
