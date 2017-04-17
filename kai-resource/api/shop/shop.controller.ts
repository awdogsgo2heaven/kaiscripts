import * as auth from '../../../lib/auth/auth.service';
import * as consts from '../../../lib/config/constants';
import * as _ from 'underscore';
import * as Util from "../../../lib/helpers";
import * as crypto from 'crypto';
import * as dryer from '../dryer';
import {BadRequestError, NotFoundError} from '../../../lib/errors';
import {Avatar} from '../../../lib/data/avatar';
import {AvatarItem} from '../../../lib/data/avatar-item';
import Item from '../../../lib/items/item';
import * as Items from '../../../lib/items';
import {FactionStatistic} from "../../../lib/data/faction-statistic";
import { LocatorService } from '../../../lib/services/locator';

export async function get(req, res) {
  function serialize(item: typeof Item) {
    var schema = {
      name: item.name,
      lore: item.desc,
      _id: item.toSymbol()
    };

    return schema;
  }

  var itemId = req.params.itemId;

  const items = Items[itemId];

  if (items) {
    dryer.dry(req, res, serialize(items));
  }
  else {
    throw new NotFoundError();
  }

}

export async function sell(req, res) {
  const itemId = req.params.itemId;

  await req.user.avatar.sell(itemId);

  res.sendStatus(200);
}

export async function buy(req, res) {
  const itemId = req.params.itemId;

  await req.user.avatar.buy(itemId);

  res.sendStatus(200);
}

export async function all(req, res) {
  //serializes this controller method
  function serialize(items: Item[]) {
    return _.map(items, function(item) {
      return {
        name: item.name,
        _id: item.id,
        price: item.buyPrice
      }
    });
  }

  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.pagesize) || 10;
  var category = req.query.category;
  category = consts.ItemTypes.indexOf(category) > -1 ? category : consts.ItemTypes[0];
  const index = page * size;

  const lastKnownLocation =  await req.user.getLastKnownLocation();
  const service = new LocatorService({ user: req.user }, req.socket);
  const region = await service.findRegion(lastKnownLocation);
  const faction = await FactionStatistic.getFactionControl(region);

  const inControl = req.user.avatar.faction === faction;

  var accessibility = req.user.avatar.storeAccessibility;
  
  console.log(accessibility);

  const items = _.values(Items).filter(x => x.isAvailable && (inControl? x.accessibility === consts.StoreAccessbility.Control : false) || accessibility.indexOf(x.accessibility) > -1 ).slice(index, index + size) as Item[];
  
  if (items.length > 0) {
    return dryer.dry(req, res, { total: items.length, items: serialize(items) });
  }
  else {
    throw new NotFoundError();
  }

};
