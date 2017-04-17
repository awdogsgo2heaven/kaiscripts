'use strict';

import * as consts from '../config/constants';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import * as Util from "../helpers";
import Item, {IItemEffect} from '../items/item';
import {IEffect, EffectType} from '../helpers/common';

import {AvatarItem} from '../data/avatar-item';
import {Account} from '../data/account';

import * as SocketIO from 'socket.io';
import Attack from '../attacks/attack';
import {AvatarKaiScript} from '../data/avatar-kai-script';

export default class ItemService {

  constructor(public user: Account) {

  }

  async use(itemId: number, kaiScriptId: number) {
    //remove item from Inventory
    var item = await AvatarItem.getItemByAvatar(this.user.avatar.id, itemId);
    var kaiScript = await AvatarKaiScript.getKaiScriptByAvatar(this.user.avatar.id, kaiScriptId);

    if(item.item.itemType === 'field') {
      await AvatarItem.destroy(this.user.avatar.id, itemId);
      return await item.item.apply(kaiScript);
    }

    return {
      text: 'No Effect',
      type: EffectType.None
    }
  }
}
