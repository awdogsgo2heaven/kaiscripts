import {Account} from '../../lib/data/account';

export interface ICoord {
  lat: number
  lon: number
  createdAt: number
}
export interface ITile {
  x: number
  y: number
  createdAt: number
}

export interface IGeoJSON {
  coordinates: number[]
}

export const enum ElementType {
  None = 0,
  Water,
  Wood,
  Fire,
  Earth,
  Metal
}

export const enum EffectType {
  None,
  Bandwidth,
  Damage,
  Cure,
}

export interface IEffect {
  text: string,
  type: EffectType,
}