import * as consts from '../../../lib/config/constants';
import * as _ from 'underscore';
import * as Util from "../../../lib/helpers";
import {FactionStatistic} from "../../../lib/data/faction-statistic";
import {LocatorService} from '../../../lib/services/locator';

import * as dryer from '../dryer';


export async function journal(req, res) {
  res.json(dryer.dry(req, res, req.user.avatar.journal));
}

export async function factions(req, res) {
  const lastKnownLocation =  await req.user.getLastKnownLocation();
  const service = new LocatorService({ user: req.user }, req.socket);
  const region = await service.findRegion(lastKnownLocation);
  const statistic = await FactionStatistic.getByRegion(region);

  res.json(dryer.dry(req, res, statistic));
}

export async function rank(req, res) {
  const lastKnownLocation =  await req.user.getLastKnownLocation();
  const service = new LocatorService({ user: req.user }, req.socket);
  const region = await service.findRegion(lastKnownLocation);
  const controlRank = await FactionStatistic.getFactionControl(region);

  res.json(dryer.dry(req, res, {
    rank: req.user.avatar.rank,
    factionControl: controlRank,
    nextRank: req.user.avatar.nextRankPoints
  }));
}

export function achievements(req, res) {
  res.sendStatus(200);
}

export function faction(req, res) {
  res.sendStatus(200);
}
