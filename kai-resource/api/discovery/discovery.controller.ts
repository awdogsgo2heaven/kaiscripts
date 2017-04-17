import * as consts from '../../../lib/config/constants';
import * as _ from 'underscore';
import * as Util from "../../../lib/helpers";
import {KaiScriptService} from '../../../lib/services/kai-scripts';
import {LocatorService} from '../../../lib/services/locator';
import {BadRequestError, NotFoundError, ValidationError} from '../../../lib/errors';
import {Barcode} from '../../../lib/data/barcode';
import {Avatar} from '../../../lib/data/avatar';
import {BattleEvent} from '../../../lib/data/battle-event';
import {BattleResult} from '../../../lib/data/battle-result';
import {AvatarKaiScript} from '../../../lib/data/avatar-kai-script';
import * as request from 'request';
import {sprintf} from 'sprintf-js';
import * as turf from 'turf';

export async function map(req, res) {

  const tileCoord = { y: req.params.y, x: req.params.x, createdAt: Date.now() };

  const service = new LocatorService({ user: req.user }, req.io);
  const map = await service.update(tileCoord);

  res.json(map);
}


export async function take(req, res) {

  const coords = { lon: req.params.y, lat: req.params.x, createdAt: Date.now() };
  const service = new LocatorService({ user: req.user }, req.io);
  const item = await service.claimItem(coords);
  
  res.json(item);
};

export async function home(req, res) {

  await req.user.setHomePoint(req.body.lon, req.body.lat);

  res.sendStatus(200);
};


export async function fuse(req, res) {

  //serializes this controller method
  function serialize(kaiScript: AvatarKaiScript) {
    return {
      _id: kaiScript.id,
      primaryType: kaiScript.base.primaryType,
      secondaryType: kaiScript.base.secondaryType,
      base: kaiScript.base.toSymbol(),
      name: kaiScript.name
    };
  }

  const leftId = req.body.leftParentId;
  const rightId = req.body.rightParentId;

  const service = new KaiScriptService(req.user);
  const kaiScript = await service.fuse(leftId, rightId);
  var result = serialize(kaiScript);
  res.json(result);

};

export async function barcode(req, res) {
  const barcode = req.body.barcode;
  const standard = req.body.standard;
  const avatarId = req.user.AvatarId;

  await Barcode.insert(barcode, standard);

  const bonuses = consts.BarcodeBonuses;

  //choose random bonus
  const bonus = bonuses[Math.floor(Math.random() * bonuses.length)];

  await req.user.avatar.addCoins(bonus);

  res.json({ bonus: bonus });
};

export async function join(req, res) {
  const id = req.params.id;
  const name = req.body.name;

  const result = await BattleEvent.getResult(req.user.AvatarId, id);

  console.log(result.data);

  if(result.isWinner && !result.isInfected && result.isEventComplete && !result.isAccepted) {

    var player = result.cache.players[1];
    var kaiScript = player.kaiScripts[0];
    
    await BattleResult.accept(result.id, req.user.avatar.id);

    var newKaiScript = await req.user.avatar.addKaiScript(kaiScript.base, name);

    res.sendStatus(200);
  }
  else {
    throw new NotFoundError();
  }
  //result.cache.
};

export async function result(req, res) {
  //serializes this controller method
  function serialize(event: BattleResult) {

    if (event.isWinner) {
      return {
        isWinner: true,
        totalDamage: event.totalDamage,
        totalTime: event.time,
        points: event.data.points,
        isInfected: event.data.isInfected,
        coinsWon: event.coins
      };
    }
    else {
      return {
        isWinner: false,
        totalDamage: undefined,
        totalTime: undefined,
        points: undefined,
        isInfected: undefined,
        coinsWon: undefined
      }
    }
  }

  const id = req.params.id;
  const result = await BattleEvent.getResult(req.user.AvatarId, id);

  res.json(serialize(result));
};
