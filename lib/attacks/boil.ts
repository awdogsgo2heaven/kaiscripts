'use strict';

import Attack, {AttackType} from './attack';
import PlayerState from '../objects/player-state'; 
import Corruption from '../statuses/corruption';
import * as consts from '../config/constants';
import {ElementType} from '../helpers/common';
import * as Collections from 'typescript-collections';

export default class Boil extends Attack {
  static get name(): string {
    return 'Boil';
  }
  get baseDamage(): number {
    return 45.0;
  }
  get combos() {
    const dict = new Collections.Dictionary<ElementType, ElementType>();
    dict.setValue(ElementType.Wood, ElementType.Fire);
    dict.setValue(ElementType.Earth, ElementType.Metal);
    dict.setValue(ElementType.Fire, ElementType.Water);
    dict.setValue(ElementType.Metal, ElementType.Water);
    dict.setValue(ElementType.Water, ElementType.Wood);
    return dict;
  }
  
  static get type(): AttackType {
    return AttackType.Technical;
  }
  static get cost(): number {
    return 40.0;
  }
  static get castTime(): number {
    return 2.5;
  }
  get animationTime(): number {
    return 2.5;
  }
  static get elementType(): ElementType {
    return ElementType.Water;
  }
  static toSymbol(): string {
    return 'Boil';
  }
}
