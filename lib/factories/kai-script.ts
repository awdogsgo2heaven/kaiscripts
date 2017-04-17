'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as KaiScripts from '../kai-scripts';
import {AvatarKaiScript, IAvatarKaiScriptSql} from '../data/avatar-kai-script';
import {AvatarItem, IAvatarItemSql} from '../data/avatar-item';
import {Avatar} from '../data/avatar';
import {AvatarKaiScriptAttack, IAvatarKaiScriptAttackSql} from '../data/avatar-kai-script-attack';
import KaiScript from '../kai-scripts/kai-script';
import * as bases from '../kai-scripts';

export class KaiScriptFactory {
  constructor() {
  }

  static async generate(kaiScript: typeof KaiScript) {
    const attacks = kaiScript.getAttacks();
    var order = 0;
    const attackList = attacks.map(x => x.toSymbol());

    var spawn = new AvatarKaiScript({
      id: -1,
      name: kaiScript.name,
      base: kaiScript.toSymbol(),
      trait: kaiScript.trait.toSymbol(),
      virus: kaiScript.virus.toSymbol(),
      teamOrder: 1,
      attacks: attackList
    });

    return spawn;
  }


}

//
// module.exports = {
//   create: function(id, level) {
//     return KaiScript.findOne({_id: id}).exec().then(function(kaiScript) {
//       var atk1 = _.sample(kaiScript.whitelists.attacks);
//       var atk2 = _.sample(kaiScript.whitelists.attacks);
//       var atk3 = _.sample(kaiScript.whitelists.attacks);
//       var atk4 = _.sample(kaiScript.whitelists.attacks);
//
//       return Promise.props(
//         {
//           atk1: Attack.findOne({_id: atk1}).exec(),
//           atk2: Attack.findOne({_id: atk2}).exec(),
//           atk3: Attack.findOne({_id: atk3}).exec(),
//           atk4: Attack.findOne({_id: atk4}).exec()
//         }
//       ).then(function(result) {
//
//         return new AvatarKaiScript({
//           avatar: null,
//           base: kaiScript,
//           teamOrder: 1,
//           attacks: [
//                 {
//                   order: 1,
//                   base: result.atk1
//                 },
//                 {
//                   order: 2,
//                   base: result.atk2
//                 },
//                 {
//                   order: 3,
//                   base: result.atk3
//                 },
//                 {
//                   order: 4,
//                   base: result.atk4
//                 }
//               ]
//
//         });
//
//       }).then(function(kaiScript) {
//         var exp = kaiScript.getRequiredExp(1);
//         kaiScript.incExperiencePoints(exp);
//         return kaiScript;
//       });
//     });
//   }
// };
