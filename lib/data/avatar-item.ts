'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as Util from "../helpers";
import Item from '../items/item';
import Trait from '../traits/trait';
import base from '../kai-scripts/kai-script';
import Status from '../statuses/status';
import * as bases from '../kai-scripts';
import * as Traits from '../traits';
import {ValidationError, NotFoundError, BadRequestError} from '../errors';
import * as Items from '../items';
import * as pg from 'pg-promise';
import db from './index';
import * as crypto from 'crypto';
import * as BlueBird from 'bluebird';
import {Avatar} from './avatar';

const sqlCreateItem = new pg.QueryFile('../lib/data/sql/createItem.sql', {
  compress: true
});

const sqlGetItem = new pg.QueryFile('../lib/data/sql/getItem.sql', {
  compress: true
});

const sqlDestroyItem = new pg.QueryFile('../lib/data/sql/destroyItem.sql', {
  compress: true
});

const sqlGetItemCounts = new pg.QueryFile('../lib/data/sql/getAvatarItemCountByItemType.sql', {
  compress: true
});

const sqlGetItemDuplicateCount = new pg.QueryFile('../lib/data/sql/getAvatarItemDuplicateCount.sql', {
  compress: true
});

const sqlGetItems = new pg.QueryFile('../lib/data/sql/getItems.sql', {
  compress: true
});

const sqlGetSellableItems = new pg.QueryFile('../lib/data/sql/getSellableItems.sql', {
  compress: true
});

const sqlGetKaiScriptItems = new pg.QueryFile('../lib/data/sql/getKaiScriptItems.sql', {
  compress: true
});

const sqlGetKaiScriptEquippableItems = new pg.QueryFile('../lib/data/sql/getKaiScriptEquippableItems.sql', {
  compress: true
});

const sqlGetKaiScriptEquippedItems = new pg.QueryFile('../lib/data/sql/getKaiScriptEquippedItems.sql', {
  compress: true
});

const sqlEquipItem = new pg.QueryFile('../lib/data/sql/equipItem.sql', {
  compress: true
});

const sqlUnEquipItem = new pg.QueryFile('../lib/data/sql/unequipItem.sql', {
  compress: true
});

const sqlEncryptItem = new pg.QueryFile('../lib/data/sql/encryptItem.sql', {
  compress: true
});

const sqlDecryptItem = new pg.QueryFile('../lib/data/sql/decryptItem.sql', {
  compress: true
});

const sqlCacheItem = new pg.QueryFile('../lib/data/sql/cacheItem.sql', {
  compress: true
});


export interface IAvatarItemList {
  rows: AvatarItem[]
  count: number
}

export interface IItemTypeCount {
  itemType: string,
  count: number
}

export interface IItemDuplicateCount {
  count: number
}

export interface IAvatarItemSql {
  id: number
  isEncrypted: boolean
  encryptedAt: Date
  encryptedSecret: string
  isAvailable: boolean
  isEquipped: boolean
  equippedAt: Date
  slot: string
  itemType: string
  item: string
}


export class AvatarItem {

  constructor(public data: IAvatarItemSql) {

  }

  get id(): number {
    return this.data.id;
  }

  get isEquipped(): boolean {
    return this.data.isEquipped;
  }

  get isCached(): boolean {
    return this.isEquipped && this.slot.indexOf('cache') > -1;
  }

  get encryptedSecret(): string {
    return this.data.encryptedSecret;
  }

  get isEncrypted(): boolean {
    return this.data.isEncrypted;
  }

  get isAvailable(): boolean {
    return this.data.isAvailable;
  }

  get item(): typeof Item {
    const item = Items[this.data.item];

    if (!item) {
      throw new BadRequestError(`Item with symbol ${this.data.item} can not be found`);
    }

    return item;
  }

  get itemType(): string {
    return this.data.itemType;
  }

  get slot(): string {
    return this.data.slot;
  }

  static getItemByAvatar(avatarId: number, itemId: number): Promise<AvatarItem> {
    return db().oneOrNone(sqlGetItem, { id: itemId, avatarId: avatarId }).then((data: IAvatarItemSql) => {
      if (data) {
        return new AvatarItem(data);
      }
      else {
        throw new NotFoundError();
      }
    });
  }

  static getItems(avatarId, category, page, size): Promise<IAvatarItemList> {
    return db().manyOrNone(sqlGetItems, { itemType: category, avatarId: avatarId, offset: page * size, limit: size }).then((data: IAvatarItemSql[]) => {
      if (data.length > 0) {
        var item = _.first(data);
        return {
          count: parseInt(item.fullCount) || 0,
          rows: data.map((datum) => new AvatarItem(datum))
        }
      }
      return {
        count: 0,
        rows: []
      }
    });
  }

  static getSellableItems(avatarId: number, category: string, page: number, size: number): Promise<IAvatarItemList> {
    return db().manyOrNone(sqlGetSellableItems, { avatarId: avatarId, offset: page * size, limit: size, itemType: category }).then((data: IAvatarItemSql[]) => {
      if (data.length > 0) {
        var item = _.first(data);
        return {
          count: parseInt(item.fullCount) || 0,
          rows: data.map((datum) => new AvatarItem(datum))
        }
      }
      return {
        count: 0,
        rows: []
      }
    });
  }

  static getItemsByKaiScript(avatarId, avatarKaiScriptId, category, page, size): Promise<IAvatarItemList> {
    return db().manyOrNone(sqlGetKaiScriptItems, { avatarId: avatarId, avatarKaiScriptId: avatarKaiScriptId, offset: page * size, limit: size, itemType: category }).then((data: IAvatarItemSql[]) => {
      if (data.length > 0) {
        var item = _.first(data);
        return {
          count: parseInt(item.fullCount) || 0,
          rows: data.map((datum) => new AvatarItem(datum))
        }
      }
      return {
        count: 0,
        rows: []
      }
    });
  }

  static getHacksEquippedByKaiScript(avatarId: number, kaiScriptId: number) {
    return db().manyOrNone(sqlGetKaiScriptEquippedItems, { avatarId: avatarId, kaiScriptId: kaiScriptId, itemType: 'equipment' }).then((data: IAvatarItemSql[]) => {
      if (data.length > 0) {
        var item = _.first(data);
        return {
          count: parseInt(item.fullCount) || 0,
          rows: data.map((datum) => new AvatarItem(datum))
        }
      }
      return {
        count: 0,
        rows: []
      }
    });
  }

  static getHacksAvailableByKaiScript(avatarId, kaiScriptId: number) {
    return db().manyOrNone(sqlGetKaiScriptEquippableItems, { avatarId: avatarId, kaiScriptId: kaiScriptId, itemType: 'equipment' }).then((data: IAvatarItemSql[]) => {
      if (data.length > 0) {
        var item = _.first(data);
        return {
          count: parseInt(item.fullCount) || 0,
          rows: data.map((datum) => new AvatarItem(datum))
        }
      }
      return {
        count: 0,
        rows: []
      }
    });
  }

  static equipItem(avatarId: number, itemId: number, avatarKaiScriptId: number, slot: string) {
    return db().none(sqlEquipItem, { avatarId: avatarId, id: itemId, avatarKaiScriptId: avatarKaiScriptId, slot: slot });
  }

  static unequipItem(avatarId, itemId) {
    return db().none(sqlUnEquipItem, { id: itemId, avatarId: avatarId });
  }

  static getShaderEquippedByKaiScript(avatarId: number, kaiScriptId: number) {
    return db().oneOrNone(sqlGetKaiScriptEquippedItems, { avatarId: avatarId, kaiScriptId: kaiScriptId, itemType: 'shader' }).then((data: IAvatarItemSql) => {
      if (data) {
        return new AvatarItem(data);
      }
      return null;
    });
  }

  static getShadersAvailableByKaiScript(avatarId: number, kaiScriptId: number) {
    return db().manyOrNone(sqlGetKaiScriptEquippableItems, { avatarId: avatarId, kaiScriptId: kaiScriptId, itemType: 'shader' }).then((data: IAvatarItemSql[]) => {
      if (data.length > 0) {
        var item = _.first(data);
        return {
          count: parseInt(item.fullCount) || 0,
          rows: data.map((datum) => new AvatarItem(datum))
        }
      }
      return {
        count: 0,
        rows: []
      }
    });
  }

  static encrypt(avatarId: number, itemId: number) {
    return db().oneOrNone(sqlEncryptItem, { avatarId: avatarId, id: itemId, secret: encryptionString() }).then((data: IAvatarItemSql) => {
      if (data) {
        return new AvatarItem(data);
      }
      else {
        throw new NotFoundError();
      }
    });
  }

  static decrypt(avatarId, itemId, secret) {
    return db().oneOrNone(sqlDecryptItem, { avatarId: avatarId, id: itemId, secret: secret }).then((data: IAvatarItemSql) => {
      if (data) {
        return new AvatarItem(data);
      }
      else {
        throw new NotFoundError();
      }
    });
  }

  static async getInventoryCounts(avatarId: number) {
    var counts = await db().manyOrNone(sqlGetItemCounts, { avatarId: avatarId }) as IItemTypeCount[];
    var countByType = {
      'battle': 0,
      'field': 0,
      'shader': 0,
      'equipment': 0,
      'anti-viral': 0
    };
    //check to make sure we don't succeed any max counts for item type
    for (var count of counts) {
      countByType[count.itemType] = count.count;
    }
    return countByType;
  }

  static async getDuplicateCount(avatarId: number, item: string): Promise<number> {
    var results = await db().oneOrNone(sqlGetItemDuplicateCount, { avatarId: avatarId, item: item }) as IItemDuplicateCount;
    if(results) {
      return results.count;
    }
    return 0;
  }

  static async isMaxed(avatarId: number, item: typeof Item) {
    var counts = await this.getInventoryCounts(avatarId);

    if (counts[item.itemType] >= 99) {
      return true;
    }
    return false;
  }

  static async create(avatarId: number, item: typeof Item) {
    const isMaxed = await this.isMaxed(avatarId, item)
    if (isMaxed) {
      throw new BadRequestError('Can not hold anymore items.');
    }

    await db().none(sqlCreateItem, { avatarId: avatarId, item: item.toSymbol(), itemType: item.itemType, isAvailable: item.isAvailable });
  }

  static destroy(avatarId: number, itemId: number) {
    return db().none(sqlDestroyItem, { avatarId: avatarId, id: itemId });
  }

  static fromJSON(data): AvatarItem {
    const item = new AvatarItem(data);
    return item;
  }

  static async cache(avatar: Avatar, itemId: number) {
    var cache = await avatar.findCache();
    if (cache.length >= 4) {
      throw new BadRequestError('Only up to 4 items can be cached at one time');
    }
    var slots = ['cache1', 'cache2', 'cache3', 'cache4'];
    var nextSlot = slots[cache.length];
    return db().none(sqlCacheItem, { avatarId: avatar.id, id: itemId, slot: nextSlot });
  }
}


// AvatarItem.statics.findBattleCache = function(avatar) {
//    return mongoose.model('AvatarItem').find({ avatar: avatar, isDeleted: false, 'slot.isEquipped': true, 'item.itemType': 'Reusable' }).limit(4).exec();
// }
// module.exports = mongoose.model('AvatarItem', AvatarItem);

function encryptionString() {
  return crypto.randomBytes(32).toString('base64');
}
