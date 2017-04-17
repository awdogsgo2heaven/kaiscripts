'use strict';

import * as consts from '../config/constants';

export class Tech {
  constructor(public symbol: string, public name: string, public value: number, public desc: string) {
  }
}

//quirky
export const COPYPASTA = new Tech('COPYPASTA', 'COPYPASTA', 100, 'Fought the opponent with a team full of the same KaiScript.');//Implemented
export const PYROMANIA = new Tech('PYROMANIA', 'PYROMANIA', 100, 'Vanquished an enemy with all fire.');//Implemented
export const BIG_STICK = new Tech('BIG_STICK', 'BIG STICK', 100, 'Vanquished an enemy with all wood.');//Implemented
export const HEAVY_METAL = new Tech('HEAVY_METAL', 'HEAVY METAL', 100, 'Vanquished an enemy with all metal.');//Implemented
export const HYDRAULICS = new Tech('HYDRAULICS', 'HYDRAULICS', 100, 'Vanquished an enemy with all water.');//Implemented
export const LAND_SLIDE = new Tech('LAND_SLIDE', 'LAND SLIDE', 100, 'Vanquished an enemy with all earth.');//Implemented
export const MARTYR = new Tech('MARTYR', 'MARTYR', 100, 'Vanquished an enemy through suicide.');
export const PASSIVE_AGRESSIVE = new Tech('PASSIVE_AGRESSIVE', 'PASSIVE AGRESSIVE', 100, 'Vanquished an enemy with with a status effect.');//Implemented
export const OVERKILL = new Tech('OVERKILL', 'OVERKILL', 100, 'Damage an enemy 1.5 its health.');//Implemented
export const STRATEGIC_KNOCKOUT = new Tech('STRATEGIC_KNOCKOUT', 'STRATEGIC KNOCKOUT', 100, 'Defeat an enemy with its weakness.');//Implemented

//easy
export const FIRST_HIT = new Tech('FIRST_HIT', 'FIRST HIT', 100, 'Got first strike on an opponent.');
export const FULL_FORCE = new Tech('FULL_FORCE', 'FULL FORCE', 100, 'A full team of 5 was out at least once.');//Implemented
export const MATERIALISM = new Tech('MATERIALISM', 'MATERIALISM', 100, 'Used all 4 cached items during fight.');//Implemented
export const BRINK = new Tech('BRINK', 'BRINK', 100, 'Won a fight at the brink of death.');//Implemented
export const FROST_BITE = new Tech('FROST_BITE', 'FROST BITE', 100, 'Bandwidth reached over 100 more than once.');
export const SEWER_SPELUNKING = new Tech('SEWER_SPELUNKING', 'SEWER SPELUNKING', 100, 'Survived more than 3 concurrent status effects.');//Implemented
export const EPIDEMIC = new Tech('EPIDEMIC', 'EPIDEMIC', 100, 'Infected the opponent with a virus more than once.');//Implemented

//meidum to obtain
export const AVENGE = new Tech('AVENGE', 'AVENGE', 200, 'Immediately finished off opponent who defeated a team member.');//Implemented
export const SLOW_BLEED = new Tech('SLOW_BLEED', 'SLOW BLEED', 200, 'Finished the fight after 5 minutes.');//Implemented
export const UNDERDOG = new Tech('UNDERDOG', 'UNDERDOG', 200, 'Defeated an opponent a higher level than you.');//Implemented
export const DENIAL_OF_SERVICE = new Tech('DENIAL_OF_SERVICE', 'DENIAL OF SERVICE', 200, 'Stunned an opponent more than once.');//Implemented
export const MAGIC_BURST = new Tech('MAGIC_BURST', 'MAGIC BURST', 200, 'Defeat an enemy with an elemental combo.');//Implemented
export const EVERLASTING = new Tech('EVERLASTING', 'EVERLASTING', 200, 'Survived more than two of your opponents.');//Implemented

//difficult to obtain
export const ONE_HIT_WONDER = new Tech('ONE_HIT_WONDER', 'ONE HIT WONDER', 500, 'Wiped an opponent in one hit.');//Implemented
export const PURISM = new Tech('PURISM', 'PURISM', 500, 'Did not use an item the entire fight.');//Implemented
export const SUPERSONIC = new Tech('SUPERSONIC', 'SUPERSONIC', 500, 'Finished the fight in less than 30 seconds.');//Implemented
export const ONE_MAN_ARMY = new Tech('ONE_MAN_ARMY', 'ONE MAN ARMY', 500, 'Defeated your opponent with one KaiScript.');//Implemented
export const REVOLUTION = new Tech('REVOLUTION', 'REVOLUTION', 500, 'Traversed the entire elemental wheel.');//Implemented
export const GRAVE_KILL = new Tech('GRAVE_KILL', 'GRAVE KILL', 500, 'Defeated an opponent from the grave.');//Implemented
export const FORTUNE_CALLS = new Tech('FORTUNE_CALLS', 'FORTUNE CALLS', 500, 'Struck luck on every chance based action.');//Implemented
export const NAKED_THREAT = new Tech('NAKED_THREAT', 'NAKED THREAT', 500, 'Won the fight with no mods.');//Implemented
