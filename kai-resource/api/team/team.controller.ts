import * as auth from '../../../lib/auth/auth.service';
import * as consts from '../../../lib/config/constants';
import * as _ from 'underscore';
import * as Util from "../../../lib/helpers";
import * as crypto from 'crypto';
import * as dryer from '../dryer';
import {BadRequestError, NotFoundError} from '../../../lib/errors';
import {Avatar} from '../../../lib/data/avatar';

export async function all(req, res) {
  //serializes this controller method
  function serialize(team: string, kaiScripts) {

    var schema = {
      team: team,
      members: _.map(kaiScripts, function(kaiScript) {
        return {
          name: kaiScript.name,
          primaryType: kaiScript.base.primaryType,
          secondaryType: kaiScript.base.secondaryType,
          health: kaiScript.health,
          base: kaiScript.base.toSymbol(),
          _id: kaiScript.id,
        }
      })
    }
    return schema;
  }

  const avatarId = req.user.AvatarId;
  const kaiScripts = await req.user.avatar.findTeam();
  if (kaiScripts) {
    dryer.dry(req, res, serialize(req.user.avatar.team, kaiScripts));
  }
  else {
    res.sendStatus(404);
  }
};

export async function rename(req, res) {
  const newName = req.body.name;
  await req.user.avatar.renameTeam(newName);
  res.sendStatus(200);
}

export async function reorder(req, res) {
  const mapping = req.body;

  await req.user.avatar.reorderTeam(mapping);

  res.sendStatus(200);
}

export async function add(req, res) {
  const id = req.params.id;

  await req.user.avatar.addTeamMember(id);

  res.sendStatus(200);
};
export async function remove(req, res) {
  const id = req.params.id;

  await req.user.avatar.removeTeamMember(id);

  res.sendStatus(200);
};
