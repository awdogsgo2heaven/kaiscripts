'use strict';


import * as consts from '../config/constants';
import Peddler from '../traits/peddler';
import SwiftLeaf from '../attacks/swift-leaf';
import Attack from '../attacks/attack';
import Glide from '../attacks/glide';
import TwisterDive from '../attacks/twister-dive';

import KaiScript from '../kai-scripts/kai-script';
import Trait from '../traits/trait';
import {ElementType} from '../helpers/common';

export default class Tanuleaf extends KaiScript {

  static get name(): string {
    return 'Tanuleaf';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return Peddler;
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
    return 'Tanuleaf';
  }

  static get attacks(): typeof Attack[] {
    return [SwiftLeaf, Glide, TwisterDive]
  }
}
