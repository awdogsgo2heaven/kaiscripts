'use strict';

export default class GameTimer {

  public timerId: NodeJS.Timer
  public start: number
  public remaining: number
  public finished: () => void;

  constructor(delay: number, callback: () => void) {
    this.timerId = null;
    this.start = null;
    this.remaining = delay;
    this.finished = callback;
  }

  pause(): void {
    clearTimeout(this.timerId);
    this.remaining -= +new Date() - this.start;
  }

  resume(): void {
    this.start = +new Date();
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.finished, this.remaining);
  }
}
