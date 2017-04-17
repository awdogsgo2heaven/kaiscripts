'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as Util from "../helpers";
import * as KaiScripts from '../kai-scripts';
import KaiScript from '../kai-scripts/kai-script';
import {Account} from '../data/account';
import {AvatarKaiScript} from '../data/avatar-kai-script';
import {ValidationError, NotFoundError, BadRequestError} from '../errors';
import * as Collections from 'typescript-collections';

export class KaiScriptService {

  constructor(public user: Account) {
  }

  findBase(left, right) {
    return _.sample([left, right]);
  }

  async fuse(leftId: number, rightId: number) {

    const left = await AvatarKaiScript.getKaiScriptByAvatar(this.user.avatar.id, leftId);
    const right = await AvatarKaiScript.getKaiScriptByAvatar(this.user.avatar.id, rightId);

    if (left.isTeamMember || right.isTeamMember) {
      throw new ValidationError('Can not fuse members of your team, remove them first');
    }
    //console.log(right);
    await left.unequipAll();
    await left.destroy();

    await right.unequipAll();
    await right.destroy();

    const mergers = new Collections.Set<typeof KaiScript>();

    mergers.add(left.base);
    mergers.add(right.base);

    var isNew = false;

    var base = null;
    var trait = null;

    for(const symbol in KaiScripts) {
      const kaiScript = KaiScripts[symbol] as typeof KaiScript;

      if(kaiScript.parents.isSubsetOf(mergers)) {
        base = kaiScript;
        trait = kaiScript.trait;
        break;
      }

    }

    if(base == null) {
      base = this.findBase(left, right);
      trait = left == base ? right.trait : left.trait;
    }
    const attacks = base.base.attacks.concat([trait.attack]);

    const leftParent = await left.parent();
    const rightParent = await right.parent();

    const kaiScript = await AvatarKaiScript.create(this.user.avatar.id, base.base.name, base.base.toSymbol(), trait.toSymbol(), attacks.map(x => x.toSymbol()), leftParent, rightParent);

    return kaiScript;
  }
}
