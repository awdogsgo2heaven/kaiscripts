'use strict';


import * as consts from '../config/constants';
import Gutsy from '../traits/gutsy';
import Shock from '../attacks/shock';
import Overheat from '../attacks/overheat';
import Toast from '../attacks/toast';
import Trait from '../traits/trait';
import KaiScript from '../kai-scripts/kai-script';
import {ElementType} from '../helpers/common';
import Attack from '../attacks/attack';

export default class Valoroast extends KaiScript {

  static get name(): string {
    return 'Valoroast';
  }

  static get desc(): string {
    return ""
  }

  static get trait(): typeof Trait {
    return Gutsy;
  }

  static get primaryType(): ElementType {
    return ElementType.Earth;
  }

  static get secondaryType(): ElementType {
    return null;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Valoroast';
  }

  static get attacks(): typeof Attack[] {
    return [Toast, Shock, Overheat]
  }
}
