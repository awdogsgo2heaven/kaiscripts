SELECT "DeleteFunction"('FinishBattle'::text);

CREATE OR REPLACE FUNCTION "FinishBattle"(
  event_id integer,
  battle_cache jsonb,
  player_one_avatar_id integer,
  player_one_coins integer,
  player_one_status "enum_BattleResults_status",
  player_one_time numeric,
  player_one_damage integer,
  player_one_infection boolean,
  player_one_points integer,
  player_two_avatar_id integer,
  player_two_coins integer,
  player_two_status "enum_BattleResults_status",
  player_two_time numeric,
  player_two_damage integer,
  player_two_infection boolean,
  player_two_points integer,
  match_type character varying
)
RETURNS VOID
/*RETURNS TABLE (
  "signInAt" timestamp with time zone,
  attempts integer,
  "signIns" integer,
  "accessToken" varchar(255),
  device   uuid,   -- visible as OUT parameter inside and outside function
  "isVerified" boolean
)*/
AS
$$

DECLARE i jsonb;
DECLARE player_one jsonb;
DECLARE player_two jsonb;

BEGIN

select * from jsonb_array_elements(battle_cache->'players') as data(x) where (data.x::jsonb->'avatar'->>'id')::integer = player_one_avatar_id into player_one;
select * from jsonb_array_elements(battle_cache->'players') as data(x) where (data.x::jsonb->'avatar'->>'id')::integer = player_two_avatar_id into player_two;

--update results of battle
update "BattleResults"
  set "coins" = player_one_coins,
  "status" = player_one_status,
  "time" = player_one_time,
  "totalDamage" = player_one_damage,
  "isInfected" = player_one_infection,
  "points" = player_one_points
where "BattleEventId" = event_id and "AvatarId" = player_one_avatar_id;

update "BattleResults"
  set "coins" = player_two_coins,
  "status" = player_two_status,
  "time" = player_two_time,
  "totalDamage" = player_two_damage,
  "isInfected" = player_two_infection,
  "points" = player_two_points
where "BattleEventId" = event_id and "AvatarId" = player_two_avatar_id;

--persist player health and statuses if this is a wild match_type
IF(match_type = 'wild') THEN
  FOR i IN SELECT * FROM jsonb_array_elements((battle_cache->0->'kaiScripts'))
  LOOP
     UPDATE "AvatarKaiScripts"
     set health = (i->>'health')::integer,
         statuses = (i->>'statuses')::jsonb
     where id = (i->>'id')::integer;
  END LOOP; 
END IF;


--update journals
FOR i IN SELECT * FROM jsonb_array_elements(player_one->'kaiScripts')
LOOP
  UPDATE "Avatars"
  set journal = array_append(journal, (i->>'base')::varchar(255)) 
  where id = player_two_avatar_id and NOT ((i->>'base')::varchar(255) = ANY (journal));
END LOOP;

FOR i IN SELECT * FROM jsonb_array_elements(player_two->'kaiScripts')
LOOP
  UPDATE "Avatars"
  set journal = array_append(journal, (i->>'base')::varchar(255)) 
  where id = player_one_avatar_id and NOT ((i->>'base')::varchar(255) = ANY (journal));
END LOOP;


IF(player_one_status = 'win' and player_one->'avatar'->'faction' IS NOT NULL) THEN
--update faction stats
INSERT INTO "FactionStatistics" (
    "week", 
    "region", 
    "city", 
    "cityId",
    "updatedAt",
    "createdAt",
    "points",
    "faction"
    ) 
VALUES (
    extract(epoch FROM CURRENT_TIMESTAMP)::bigint / 604800, 
    battle_cache->'location'->'region'->>'region',
    battle_cache->'location'->'region'->>'city',
    battle_cache->'location'->'region'->>'cityId',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    player_one_points,
    (player_one->'avatar'->>'faction')::"enum_Avatars_faction" 
)
ON CONFLICT ("cityId", "week") DO UPDATE 
    SET points = excluded.points + "FactionStatistics".points,
    "updatedAt" = CURRENT_TIMESTAMP;
ELSIF(player_two_status = 'win' and player_two->'avatar'->'faction' IS NOT NULL) THEN
--update faction stats
INSERT INTO "FactionStatistics" (
    "week", 
    "region", 
    "city", 
    "cityId",
    "updatedAt",
    "createdAt",
    "points",
    "faction"
    ) 
VALUES (
    extract(epoch FROM CURRENT_TIMESTAMP)::bigint / 604800, 
    battle_cache->'location'->'region'->>'region',
    battle_cache->'location'->'region'->>'city',
    battle_cache->'location'->'region'->>'cityId',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    player_two_points,
    (player_two->'avatar'->>'faction')::"enum_Avatars_faction" 
)
ON CONFLICT ("cityId", "week") DO UPDATE 
    SET points = excluded.points + "FactionStatistics".points,
    "updatedAt" = CURRENT_TIMESTAMP;
END IF;
--increment/decrement win and losses


IF(player_one_status = 'win') THEN
  update "Avatars"
    set wins = wins + 1,
    points = points + player_one_points
  where "id" = player_one_avatar_id;
ELSIF(player_one_status = 'loss') THEN
  update "Avatars"
    set losses = losses + 1,
    points = points + player_one_points
  where "id" = player_one_avatar_id;
ELSIF (player_one_status = 'disconnect') then
  update "Avatars"
    set disconnects = disconnects + 1,
    points = points + player_one_points
  where "id" = player_one_avatar_id;
END IF;

IF(player_two_status= 'win') THEN
  update "Avatars"
    set wins = wins + 1,
    points = points + player_two_points
  where "id" = player_two_avatar_id;
ELSIF(player_two_status = 'loss') THEN
  update "Avatars"
    set losses = losses + 1,
    points = points + player_two_points
  where "id" = player_two_avatar_id;
ELSIF (player_two_status = 'disconnect') then
  update "Avatars"
    set disconnects = disconnects + 1,
    points = points + player_two_points
  where "id" = player_two_avatar_id;
END IF;




--Mark event as complete and save final state
update "BattleEvents"
  set "isComplete" = true,
  "cache" = battle_cache
where "id" = event_id;
END;
$$
LANGUAGE 'plpgsql'
