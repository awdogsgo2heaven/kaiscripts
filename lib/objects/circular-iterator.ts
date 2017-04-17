'use strict';

export default class CircularIterator<T> {

  public current: number = 0;

  constructor(public array: T[]) {

  }

  next(): T {
    var nextIndex = this.current + 1;
    if (nextIndex >= this.array.length) {
      nextIndex = 0;
    }
    this.current = nextIndex;
    return this.array[nextIndex];
  }
  now(): T {
    return this.array[this.current];
  }
  previous(): T {
    var nextIndex = this.current - 1;
    if (nextIndex < 0) {
      nextIndex = this.array.length - 1;
    }
    this.current = nextIndex;

    return this.array[nextIndex];
  }
}
