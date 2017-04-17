with myid as (insert into "BattleEvents" ("matchType", "cache", "createdAt", "updatedAt")
  values('wild', ${cache}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) returning id)
insert into "BattleResults" ("BattleEventId", "AvatarId", "createdAt", "updatedAt")
  values((select * from myid), ${avatarId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) returning "BattleEventId";
