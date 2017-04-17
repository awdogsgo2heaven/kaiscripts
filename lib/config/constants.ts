export enum StoreAccessbility {
  Rank1,
  Rank2,
  Rank3,
  Control  
};

export const RANK_REQS = { Rank1: 0, Rank2: 100, Rank3: 500 }
export const ResourceTypes = ['Avatar', 'KaiScript', 'Item', 'Attack'];
export const FACTIONS = { RED: 'Militarists', BLUE: 'Hactivists'};

export const Achievements = ['Militarists', 'Hactivists'];
export const ItemTypes = ['battle', 'field', 'equipment', 'shader', 'anti-viral'];
export const ItemActions = ['status', 'zeal', 'exp', 'root-kit', 'stat', 'upgrade', 'mod'];
export const AttackTypes = ['Brute', 'Technical'];
export const SlotTypes = ['QUICK', 'USERMOD', 'SHADER', 'NONE'];
export const BarcodeBonuses = [5, 10, 15, 20];
export const StarterLevel = 3;
export const MaxEXP = 9999;
export const MaxZEAL = 99;
export const MaxCOINS = 999999;
export const NOTIFY_EXPIRE_MIN = 10;
export const MaxEXPSTAT = 999;
export const BaseStats = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
export const BaseStatsLookup = { 'S': 100, 'A': 90, 'B': 80, 'C': 70, 'D': 60, 'E': 50, 'F': 40 };
export const ZealStatuses = ['Sleeping', 'Prepared', 'Well Prepared', 'Full Throttle'];
export const ZealThresholds = { Sleeping: 0, Prepared: 12, Well: 24, Full: 96 };
export const ZealExpModifiers = { 'Sleeping': 1.0, 'Prepared': 1.10, 'Well Prepared': 1.125, 'Full Throttle': 1.5 };
export const KaiScriptStatuses = ['IDLE', 'FROZEN', 'STUN', 'CORRUPTION', 'VIRUS', 'REGEN', 'UPDATING', 'ABSORB', 'CONGESTION', 'OVERLOAD', 'COUNTER', 'STATS'];
export const TimeOfDay = ['morning', 'afternoon', 'evening', 'night'];
export const WeatherTypes = ['thunderstorm', 'drizzle', 'rain', 'snow', 'atomosphere', 'clouds', 'extreme'];
export const MAX_LEVEL = 30;
export const MAX_STAT = 300;
export const MAX_WEATHER_MILES = 20;
export const MILLI_TO_HOURS = 0.000000278;
export const CHEATER_SPEED = 500;
export const MAX_WALK_SPEED = 15;
export const BATTLE_RECOVERY_MOD = 2;
export const MAX_SWAP_TIME = 4;
export const QUICK_RESPONSE_LIFESPAN = 5000;
export const LOCK_TIME = 30;
export const BATTLE_EVENT_TYPES = ['wild', 'online'];
export const BATTLE_WINNER_TYPES = ['invader', 'defender'];
export const EXP_CONSTANT = 1000;
export const COINS_PER_MATCH = 10;
export const ZEAL_POINTS = 336;
export const HOMEPOINT_DAYS_TIL_RESET = 7;
export const DISCOVERY_REFRESH_SECONDS = 3 * 60;
export const MAX_STAT_ZEAL = 120;
export const MAX_ITEM_COUNT = 200;
export const MILES_PER_FOOT = 5280;
export const MIN_TRAVEL_FEET_REQUIRED = 50;
export const BATTLE_TIMEOUT = 300000;
export const BANDWIDTH_INTERVAL = 1000;
export const PING_INTERVAL = 1000;
export const FIRST_ATTACK_TIMEOUT = 30000;

export const EQUIP_SLOTS = {
  EQUIP_1: 1,
  EQUIP_2: 2,
  CACHE_1: 3,
  CACHE_2: 4,
  CACHE_3: 5,
  CACHE_4: 6,
  SHADER: 7
}
export const StatusTypes = {
  SLOW: 'Slow',
  POISON: 'Poison',
  CORRUPTION: 'Corruption',
  REGEN: 'Regen',
  SLEEP: 'Sleep',
  DECOY: 'Decoy',
  TRICK: 'Trick',
  STUN: 'Stun',
  HAUNT: 'Haunt',
  ABSORB: 'Absorb',
  TRAP: 'Trap',
  UNIQUE: 'Unique'
};

//# sourceMappingURL=constants.js.map
