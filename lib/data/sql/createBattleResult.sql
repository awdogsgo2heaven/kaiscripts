DO
$do$
BEGIN
update "BattleResults"
  set "coins" = ${winnerCoins},
  "techs" = ${winnerTechs},
  "status" = ${winnerStatus},
  "time" = ${winnerTime}
where "BattleEventId" = ${eventId} and "AvatarId" = ${winnerId};

update "BattleResults"
  set "coins" = ${loserCoins},
  "techs" = ${loserTechs},
  "status" = ${loserStatus},
  "time" = ${loserTime}
where "BattleEventId" = ${eventId} and "AvatarId" = ${loserId};

IF(${loserStatus} = 'loss') THEN
  update "Avatars"
    set losses = losses + 1
  where "id" = ${loserId};
ELSIF (${loserStatus} = 'disconnect') then
  update "Avatars"
    set disconnects = disconnects + 1
  where "id" = ${loserId};
END IF;

IF(${winnerStatus} = 'win') THEN
  update "Avatars"
    set wins = wins + 1
  where "id" = ${winnerId};
ELSIF (${winnerStatus} = 'disconnect') then
  update "Avatars"
    set disconnects = disconnects + 1
  where "id" = ${winnerId};
END IF;

update "BattleEvents"
  set "status" = 'complete'
where "id" = ${eventId};
END
$do$
