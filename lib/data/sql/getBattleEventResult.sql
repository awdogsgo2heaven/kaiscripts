select be.*, bv.cache, bv."isComplete" as "isEventComplete" from "BattleResults" as be 
inner join
"BattleEvents" as bv 
on be."BattleEventId" = bv.id
where "AvatarId" = ${avatarId} and "BattleEventId" = ${id}
limit 1;
