'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as Util from "../helpers";
import Attack from '../attacks/attack';
import Trait from '../traits/trait';
import base from '../kai-scripts/kai-script';
import Status from '../statuses/status';
import { AvatarKaiScript, IAvatarKaiScriptSql } from './avatar-kai-script';
import { AvatarItem, IAvatarItemSql } from './avatar-item';
import { GeoDiscovery, IGeoDiscoverySql } from './geo-discovery';
import Item from '../items/item';
import KaiScript from '../kai-scripts/kai-script';
import * as bases from '../kai-scripts';
import * as Traits from '../traits';
import * as Items from '../items';

import { ValidationError, NotFoundError, BadRequestError } from '../errors';
import * as pg from 'pg-promise';
import db from './index';
import { KaiScriptFactory } from '../factories/kai-script';
import * as validators from '../helpers/validators';
import { logger } from '../helpers/logger';

const sqlRestoreKaiScript = new pg.QueryFile('../lib/data/sql/restoreKaiScript.sql', {
  compress: true
});

const sqlIncCoins = new pg.QueryFile('../lib/data/sql/incCoins.sql', {
  compress: true
});

const sqlUpdateAvatarDiscovery = new pg.QueryFile('../lib/data/sql/updateAvatarDiscovery.sql', {
  compress: true
});

const sqlTakeGeoDiscovery = new pg.QueryFile('../lib/data/sql/takeGeoDiscovery.sql', {
  compress: true
});

const sqlAddItem = new pg.QueryFile('../lib/data/sql/createItem.sql', {
  compress: true
});

const sqlCreateKaiScript = new pg.QueryFile('../lib/data/sql/createStarterKaiScript.sql', {
  compress: true
});

const sqlFindFullTeam = new pg.QueryFile('../lib/data/sql/findFullTeam.sql', {
  compress: true
});

const sqlFindBattleCache = new pg.QueryFile('../lib/data/sql/findBattleCache.sql', {
  compress: true
});

const sqlAddToJournal = new pg.QueryFile('../lib/data/sql/addToJournal.sql', {
  compress: true
});

const sqlFindFullTeamSummary = new pg.QueryFile('../lib/data/sql/findFullTeamSummary.sql', {
  compress: true
});

const sqlRenameTeam = new pg.QueryFile('../lib/data/sql/updateAvatarTeamName.sql', {
  compress: true
});

const sqlReorderTeam = new pg.QueryFile('../lib/data/sql/updateAvatarTeamOrder.sql', {
  compress: true
});

const sqlAddToTeam = new pg.QueryFile('../lib/data/sql/addToTeam.sql', {
  compress: true
});

const sqlRemoveFromTeam = new pg.QueryFile('../lib/data/sql/removeFromTeam.sql', {
  compress: true
});

export class Avatar {
  constructor(public data: IAvatarSql) {

  }

  get coins(): number {
    return this.data.coins;
  }

  get id(): number {
    return this.data.id
  }

  get team(): string {
    return this.data.team;
  }

  get journal(): string[] {
    return this.data.journal;
  }

  get faction(): string {
    return this.data.faction
  }

  get rank(): number {
    if (this.data.points >= consts.RANK_REQS.Rank3) {
      return 3;
    }
    if (this.data.points >= consts.RANK_REQS.Rank2) {
      return 2;
    }
    if (this.data.points >= consts.RANK_REQS.Rank1) {
      return 1;
    }
  }

  get nextRankPoints(): number {
    if (this.rank === 1) {
      return consts.RANK_REQS.Rank2 - this.data.points;
    } 
    if (this.rank === 2) {
      return consts.RANK_REQS.Rank3 - this.data.points;
    } 
  }


  get storeAccessibility(): consts.StoreAccessbility[] {

    var accessibility = [];
    if (this.rank > 0) {
      accessibility.push(consts.StoreAccessbility.Rank1)
    }
    if (this.rank > 1) {
      accessibility.push(consts.StoreAccessbility.Rank2)
    }
    if (this.rank > 2) {
      accessibility.push(consts.StoreAccessbility.Rank3)
    }
    return accessibility;
  }


  get GeoDiscoveryId(): number {
    return this.data.GeoDiscoveryId
  }

  get discoveryAt(): number {
    if (this.data.discoveryAt) {
      return new Date(this.data.discoveryAt).getTime();
    }
    else {
      return 0;
    }
  }

  get discoveryRefreshAt(): number {
    var date = new Date();
    date.setTime(this.discoveryAt + consts.DISCOVERY_REFRESH_SECONDS * 1000);
    return date.getTime();
  }

  addCoins(coins: number) {
    return db().none(sqlIncCoins, { amount: coins, id: this.id });
  }

  removeCoins(coins: number) {
    return this.addCoins(-coins);
  }

  addJournalEntry(kaiScript: typeof KaiScript) {
    return db().none(sqlAddToJournal, { entry: kaiScript.toSymbol(), id: this.id });
  }

  async addKaiScript(symbol: string, name?: string) {
    const base = bases[symbol];
    const attacks = base.getAttacks();

    const isMaxed = await AvatarKaiScript.isMaxed(this.id);
    
    if (isMaxed) {
      throw new BadRequestError('You have reached the max limit for KaiScripts');
    }

    var starter = new AvatarKaiScript({
      name: base.name,
      base: base.toSymbol(),
      trait: base.trait.toSymbol(),
      AvatarId: this.id
    });

    var kaiScript = await AvatarKaiScript.create(this.id, name || starter.name, starter.base.toSymbol(), starter.trait.toSymbol(), attacks.map(x => x.toSymbol()));
    return kaiScript;
  }

  async buy(itemSymbol: string) {
    const item = Items[itemSymbol];

    if (item == null) {
      throw new NotFoundError();
    }

    if (item.buyPrice > this.coins) {
      throw new ValidationError('Not enough coins!');
    }

    await this.addCoins(-item.buyPrice);

    return AvatarItem.create(this.id, item);
  }

  async sell(itemId: number) {
    var avatarItem = await AvatarItem.getItemByAvatar(this.id, itemId);

    await this.addCoins(avatarItem.item.sellPrice);

    return AvatarItem.destroy(this.id, itemId);
  }

  addDiscovery(geoDiscoveryId: number) {
    return db().none(sqlUpdateAvatarDiscovery, { id: this.id, geoDiscoveryId: geoDiscoveryId });
  }

  takeGeoDiscovery() {
    return db().one(sqlTakeGeoDiscovery, { id: this.id, geoDiscoveryId: this.GeoDiscoveryId }).then((x: IGeoDiscoverySql) => new GeoDiscovery(x));
  }

  addItem(item: typeof Item) {
    return AvatarItem.create(this.id, item);
  }

  async claimItem() {
    if (this.GeoDiscoveryId) {
      if (Date.now() < this.discoveryRefreshAt) {

        const discovery = await this.takeGeoDiscovery();
        const item = await discovery.item;
        if (item) {
          return this.addItem(item);
        }
        else {
          throw new BadRequestError('Nothing to take.');
        }
      }
      else {
        throw new BadRequestError('The item seems to have slipped away')
      }
    }
    else {
      throw new BadRequestError('Nothing to take');
    }
  }

  async claimFight() {
    if (this.GeoDiscoveryId) {
      if (Date.now() < this.discoveryRefreshAt) {

        const discovery = await this.takeGeoDiscovery();
        const kaiScript = _.sample(bases); //discovery.kaiScript;

        if (kaiScript) {
          return await KaiScriptFactory.generate(kaiScript);
        }
        else {
          throw new BadRequestError('Nothing to take.');
        }
      }
      else {
        throw new BadRequestError('The KaiScript seems to have slipped away');
      }
    }
    else {
      throw new BadRequestError('Nothing to take');
    }
  }

  async findCache(): Promise<IAvatarItemSql[]> {
    const items = await db().manyOrNone(sqlFindBattleCache, {
      id: this.id
    }) as IAvatarItemSql[];
    return items;
  }

  async findTeam(): Promise<AvatarKaiScript[]> {
    const team = await this.findRawTeamSummary()
    return team.map((x: IAvatarKaiScriptSql) => new AvatarKaiScript(x));
  }

  async findFullTeam(): Promise<AvatarKaiScript[]> {
    const team = await this.findRawTeam()
    return team.map((x: IAvatarKaiScriptSql) => new AvatarKaiScript(x));
  }

  async getDuplicateCount(item: string): Promise<number> {
    return await AvatarItem.getDuplicateCount(this.id, item);
  }

  async findRawTeamSummary(): Promise<IAvatarKaiScriptSql[]> {
    const team = await db().many(sqlFindFullTeamSummary, {
      id: this.id
    }) as IAvatarKaiScriptSql[];
    return team;
  }

  async findRawTeam(): Promise<IAvatarKaiScriptSql[]> {
    const team = await db().many(sqlFindFullTeam, {
      id: this.id
    }) as IAvatarKaiScriptSql[];
    return team;
  }

  async renameTeam(name: string) {
    validators.required('Name', name);
    validators.length(name, 10);
    validators.profanity(name);
    validators.spaces(name);
    return db().none(sqlRenameTeam, { id: this.id, name: name });
  }

  async restoreTeam() {
    const team = await this.findFullTeam();

    for (const member of team) {
      member.prepare();
      await db().none(sqlRestoreKaiScript, { id: member.id, health: member.totalHealth });
    }
  }

  async reorderTeam(mapping: { [key: string]: string }) {
    const team = await this.findTeam();

    var i = 0;

    var count = {}

    const values = _.values(mapping);

    for (var value of values) {
      count[value] = count[value] + 1 || 1
    }

    for (const member of team) {
      i++;
      const order = parseInt(mapping[i.toString()]) || -1;
      if ((order > 5 || order < 1) || count[order] > 1) {
        throw new ValidationError('Not a valid Team Member order');
      }
      await db().none(sqlReorderTeam, { id: member.id, order: order });
    }
  }

  async addTeamMember(kaiScriptId: number) {
    return db().none(sqlAddToTeam, { id: this.id, kaiScriptId: kaiScriptId });
  }

  async removeTeamMember(kaiScriptId: number) {
    return db().none(sqlRemoveFromTeam, { id: this.id, kaiScriptId: kaiScriptId });
  }
}

export interface IAvatarSql {
  id: number
  coins?: number
  name?: string
  team?: string
  statistics?: any
  faction?: string
  points?: number
  factionRank?: string
  achievements?: string[]
  GeoDiscoveryId?: number
  discoveryAt?: string
  journal?: string[]
}
