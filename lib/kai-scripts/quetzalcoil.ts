'use strict';


import * as consts from '../config/constants';
import ShinyCoat from '../traits/shiny-coat';
import MagneticShock from '../attacks/magnetic-shock';
import Constrict from '../attacks/constrict';
import MirrorFeather from '../attacks/mirror-feather';
import Screech from '../attacks/screech';

import KaiScript from '../kai-scripts/kai-script';
import Trait from '../traits/trait';
import Attack from '../attacks/attack';
import {ElementType} from '../helpers/common';

export default class Quetzalcoil extends KaiScript {

  static get name(): string {
    return 'Quetzalcoil';
  }

  static get desc(): string {
    return "Unknown"
  }

  static get trait(): typeof Trait {
    return ShinyCoat;
  }

  static get primaryType(): ElementType {
    return ElementType.Metal;
  }

  static get secondaryType(): ElementType {
    return null;
  }

  static get isStarter(): boolean {
    return false;
  }

  static toSymbol(): string {
    return 'Quetzalcoil';
  }

  static get attacks(): typeof Attack[] {
    return [Constrict, MagneticShock, Screech]
  }
}
