'use strict';


import * as consts from '../config/constants';
import Rooted from '../traits/rooted';
import Attack from '../attacks/attack';
import RootLash from '../attacks/root-lash';
import ProngRush from '../attacks/prong-rush';
import Stomp from '../attacks/stomp';

import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import {ElementType} from '../helpers/common';

export default class Mulu extends KaiScript {

  static get name(): string {
    return 'Mulu';
  }

  static get desc(): string {
    return "It can often be seen standing stock still in the middle of a field at noon. It digs its roots into the ground to absorb sunlight to grow its antlers. Their social status is determined by antler length."
  }

  static get trait(): typeof Trait {
    return Rooted;
  }

  static get primaryType(): ElementType {
    return ElementType.Wood;
  }

  static get secondaryType(): ElementType {
    return null;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Mulu';
  }

  static get attacks(): typeof Attack[] {
    return [ProngRush, RootLash, Stomp]
  }
}
