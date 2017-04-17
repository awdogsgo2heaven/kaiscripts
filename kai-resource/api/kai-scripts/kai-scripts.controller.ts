
import ItemService from '../../../lib/services/avatar-item';
import * as auth from '../../../lib/auth/auth.service';
import * as consts from '../../../lib/config/constants';
import * as _ from 'underscore';
import * as Util from "../../../lib/helpers";
import * as crypto from 'crypto';
import * as dryer from '../dryer';
import {BadRequestError, NotFoundError} from '../../../lib/errors';
import {Avatar} from '../../../lib/data/avatar';
import {AvatarKaiScript} from '../../../lib/data/avatar-kai-script';
import {AvatarItem} from '../../../lib/data/avatar-item';
import KaiScript from '../../../lib/kai-scripts/kai-script';
import Attack from '../../../lib/attacks/attack';

export async function all(req, res) {
  //serializes this controller method
  function serialize(kaiScripts: AvatarKaiScript[]) {
    return _.map(kaiScripts, function(kaiScript: AvatarKaiScript) {
      return {
        name: kaiScript.name,
        primaryType: kaiScript.base.primaryType,
        secondaryType: kaiScript.base.secondaryType,
        _id: kaiScript.id
      }
    });
  }

  var page = parseInt(req.query.page) || 0;
  var size = parseInt(req.query.pagesize) || 10;
  var search = (req.query.search || '').toLowerCase();
  const avatarId = req.user.AvatarId;

  const kaiScripts = await AvatarKaiScript.getKaiScripts(avatarId, search, page, size);
  if (kaiScripts.count > 0) {
    return dryer.dry(req, res, { total: kaiScripts.count, kaiScripts: serialize(kaiScripts.rows) });
  }
  else {
    throw new NotFoundError();
  }
}

export async function get(req, res) {
  //serializes this controller method
  function serialize(kaiScript: AvatarKaiScript) {
    return {
      _id: kaiScript.id,
      health: kaiScript.health,
      totalHealth: kaiScript.totalHealth,
      base: kaiScript.base.toSymbol(),
      name: kaiScript.name
    }
  }

  var kaiId = req.params.id;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  const kaiScript = await AvatarKaiScript.getKaiScriptByAvatar(avatarId, kaiId);
  dryer.dry(req, res, serialize(kaiScript));
}

export async function rename(req, res) {
  const kaiId = req.params.id;
  const newName = req.body.name;
  const avatarId = req.user.AvatarId;

  await AvatarKaiScript.rename(avatarId, kaiId, newName);

  res.sendStatus(200);
}

export async function stats(req, res) {
  //serializes this controller method
  function serialize(kaiScript: AvatarKaiScript) {
    return {
      _id: kaiScript.id,
      stats: {
        resiliency: kaiScript.totalResiliency,
        attack: kaiScript.totalAttack,
        security: kaiScript.totalSecurity,
        latency: kaiScript.totalLatency,
        intelligence: kaiScript.totalIntelligence,
        knowledge: kaiScript.totalKnowledge
      }
    }
  }

  var kaiId = req.params.id;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  const kaiScript = await AvatarKaiScript.getKaiScriptByAvatar(avatarId, kaiId);
  dryer.dry(req, res, serialize(kaiScript));

}

export async function skills(req, res) {
  //serializes this controller method
  function serialize(skills: typeof Attack[]) {
    return _.map(skills, function(skill: typeof Attack) {
      return {
        name: skill.name,
        elementType: skill.elementType,
        bandwidth: skill.cost
      }
    });
  }

  var kaiId = req.params.id;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  const kaiScript = await AvatarKaiScript.getKaiScriptByAvatar(req.user.avatar.id, kaiId);
  const attacks = kaiScript.attacks;

  dryer.dry(req, res, serialize(attacks));
}

export async function getSkill(req, res) {
  //serializes this controller method
  function serialize(skill: typeof Attack) {
    return {
      name: skill.name,
      lore: skill.description || '',
      attackType: skill.type,
      elementType: skill.elementType,
      castTime: skill.castTime
    }
  }

  const kaiId = req.params.id;
  const avatarId = req.user.AvatarId;
  const skillId = req.params.skill;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  const kaiScript = await AvatarKaiScript.getKaiScriptByAvatar(avatarId, kaiId);
  const attack = kaiScript.getAttack(skillId);
  return dryer.dry(req, res, serialize(attack));
}

export async function hacks(req, res) {
  //serializes this controller method
  function serialize(hacks) {
    return _.map(hacks, function(hack: AvatarItem) {
      return {
        name: hack.item.name,
        slot: hack.slot,
        _id: hack.id
      }
    });
  }

  const kaiId = req.params.id;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  const items = await AvatarItem.getHacksEquippedByKaiScript(avatarId, kaiId);
  return dryer.dry(req, res, serialize(items.rows));
}

export async function availableHacks(req, res) {
  //serializes this controller method
  function serialize(hacks) {
    return _.map(hacks, function(hack: AvatarItem) {
      return {
        name: hack.item.name,
        _id: hack.id
      }
    });
  }
  const kaiId = req.params.id;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  const items = await AvatarItem.getHacksAvailableByKaiScript(avatarId, kaiId);
  return dryer.dry(req, res, serialize(items.rows));
}

export async function addHack(req, res) {
  const kaiId = req.params.id;
  const hackId = req.params.hackId;
  const position = req.body.slot || 'slot1';
  const avatarId = req.user.AvatarId;

  if (position !== 'slot1') {
    return res.sendStatus(404);
  }
  if (kaiId == null) {
    throw new NotFoundError();
  }
  await AvatarItem.equipItem(avatarId, hackId, kaiId, position);
  res.sendStatus(200);
}

export async function removeHack(req, res) {
  const kaiId = req.params.id;
  const hackId = req.params.hackId;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  await AvatarItem.unequipItem(avatarId, hackId);
  res.sendStatus(200);
}

export async function shaders(req, res) {
  //serializes this controller method
  function serialize(hacks) {
    return _.map(hacks, function(hack) {
      return {
        name: hack.Item.name,
        slot: hack.position,
        _id: hack.id
      }
    });
  }

  const kaiId = req.params.id;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  const items = await AvatarItem.getShaderEquippedByKaiScript(avatarId, kaiId);
  return dryer.dry(req, res, serialize(items));
}

export async function availableShaders(req, res) {
  //serializes this controller method
  function serialize(hacks) {
    return _.map(hacks, function(hack) {
      return {
        name: hack.Item.name,
        _id: hack.id
      }
    });
  }
  const kaiId = req.params.id;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  const items = await AvatarItem.getShadersAvailableByKaiScript(avatarId, kaiId);
  return dryer.dry(req, res, serialize(items.rows));
}

export async function addShader(req, res) {
  const kaiId = req.params.id;
  const hackId = req.params.itemId;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  await AvatarItem.equipItem(avatarId, hackId, kaiId, 'slot1');
  res.sendStatus(200);
}

export async function removeShader(req, res) {
  const kaiId = req.params.id;
  const hackId = req.params.itemId;
  const avatarId = req.user.AvatarId;

  if (kaiId == null) {
    throw new NotFoundError();
  }

  await AvatarItem.unequipItem(avatarId, hackId);
  res.sendStatus(200);
}

export async function use(req, res) {
  const kaiScriptId = req.params.id;
  const itemId = req.params.itemId;
  const service = new ItemService(req.user);

  if (kaiScriptId == null) {
    throw new NotFoundError();
  }

  const effect = await service.use(itemId, kaiScriptId);
  res.json(effect);
}

export async function destroy(req, res) {
  const kaiId = req.params.id;
  const avatarId = req.user.AvatarId;
  //Need to unequip all items monster may have equipped first

  if (kaiId == null) {
    throw new NotFoundError();
  }

  await AvatarKaiScript.destroy(avatarId, kaiId);

  res.sendStatus(200);
}
