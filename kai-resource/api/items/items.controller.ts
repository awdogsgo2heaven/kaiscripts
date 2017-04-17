import * as auth from '../../../lib/auth/auth.service';
import * as consts from '../../../lib/config/constants';
import * as _ from 'underscore';
import * as Util from "../../../lib/helpers";
import * as crypto from 'crypto';
import * as dryer from '../dryer';
import {AvatarItem, IAvatarItemList} from '../../../lib/data/avatar-item'
import {BadRequestError, NotFoundError} from '../../../lib/errors';
import {Avatar} from '../../../lib/data/avatar';
import Item from '../../../lib/items/item';
import * as Items from '../../../lib/items';

export async function all(req, res) {
  //serializes this controller method
  function serialize(category, sellable, items: AvatarItem[]) {
    return _.map(items, function(item) {
      var schema = {
        name: item.item.name,
        isEncrypted: item.isEncrypted,
        _id: item.id,
        price: undefined,
        isCached: undefined,
        isEquipped: undefined
      };
      if (sellable) {
        schema.price = item.item.sellPrice;
      }
      if (category == 'battle') {
        schema.isCached = item.isCached;
      }
      if (category == 'shader') {
        schema.isEquipped = item.isEquipped;
      }
      return schema;
    });
  }

  var page = parseInt(req.query.page) || 0;
  var size = parseInt(req.query.pagesize) || 10;
  var category = req.query.category;
  var sellable = req.query.sellable;
  var kaiScriptId = req.query.kaiScriptId;
  var avatarId = req.user.AvatarId;

  category = consts.ItemTypes.indexOf(category) > -1 ? category : consts.ItemTypes[0];

  var result: IAvatarItemList;

  if (sellable) {
    result = await AvatarItem.getSellableItems(avatarId, category, page, size);
  }
  else if (kaiScriptId) {
    result = await AvatarItem.getItemsByKaiScript(avatarId, kaiScriptId, category, page, size);
  }
  else {
    result = await AvatarItem.getItems(avatarId, category, page, size);
  }

  dryer.dry(req, res, { total: result.count, items: serialize(category, sellable, result.rows) });
};

export async function get(req, res) {
  function serialize(item: AvatarItem) {
    var schema = {
      name: item.item.name,
      lore: item.item.desc,
      isEncrypted: item.isEncrypted,
      encryptionSecret: item.encryptedSecret,
      _id: item.id,
      isCached: undefined
    };
    if (item.item.itemType == 'battle') {
      schema.isCached = item.isCached;
    }
    return schema;
  }
  var itemId = req.params.id;
  var avatarId = req.user.AvatarId;

  if (itemId == null) {
    throw new NotFoundError();
  }

  var item = await AvatarItem.getItemByAvatar(avatarId, itemId);
  dryer.dry(req, res, serialize(item));
}

export async function encrypt(req, res) {
  var itemId = req.params.id;
  var avatarId = req.user.AvatarId;

  if (itemId == null) {
    throw new NotFoundError();
  }

  var item = await AvatarItem.encrypt(avatarId, itemId);
  res.json({ secret: item.encryptedSecret });
}

export async function decrypt(req, res) {
  function serialize(item: AvatarItem, sub: typeof Item) {
    var schema = {
      name: sub.name,
      lore: sub.desc,
      _id: item.id
    };
    return schema;
  }
  var itemId = req.params.id;
  var encryptionSecret = req.body.secret;
  var avatarId = req.user.AvatarId;

  if (itemId == null) {
    throw new NotFoundError();
  }

  var item = await AvatarItem.decrypt(avatarId, itemId, encryptionSecret);
  var sub = await item.item;
  var test = serialize(item, sub);
  res.sendStatus(200);
}

export async function destroy(req, res) {
  var itemId = req.params.id;
  var avatarId = req.user.AvatarId;

  if (itemId == null) {
    throw new NotFoundError();
  }

  await AvatarItem.destroy(avatarId, itemId);
  res.sendStatus(200);
}

export async function addCache(req, res) {
  var itemId = req.params.id;

  if (itemId == null) {
    throw new NotFoundError();
  }

  await AvatarItem.cache(req.user.avatar, itemId);
  return res.sendStatus(200);
}

export async function removeCache(req, res) {
  var itemId = req.params.id;
  var avatarId = req.user.AvatarId;

  if (itemId == null) {
    throw new NotFoundError();
  }

  var result = await AvatarItem.unequipItem(avatarId, itemId);

  return res.sendStatus(200);

}
