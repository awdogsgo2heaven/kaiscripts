import {PlayerKaiScript} from './player-kai-script';
import {AttackReaction} from '../attacks/attack';
import {PlayerDamage} from '../objects/player-damage';
import Status from '../statuses/status';

export interface IBattleTrigger {

  attacker: PlayerKaiScript
  defender: PlayerKaiScript

  //triger is called during player death
  triggerDeath(): boolean

  //trigger is called when reacting
  triggerReaction(playerDamage: PlayerDamage): boolean

  //trigger is called when taking damage
  triggerDamage(playerDamage: PlayerDamage): boolean

  //trigger is called before adding status 
  triggerAddStatus(status: Status): boolean

  //trigger is called when trying to cast  
  triggerTryCast(state: { position: number }): boolean
  
  //trigger is called when casting
  triggerCast(): boolean

  //trigger is called when attack has finished
  triggerAttack(): boolean

  //triger is called after being hit by attack
  triggerHit(): boolean
}