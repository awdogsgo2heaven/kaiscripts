select *, array_to_json(array((
         SELECT
         row_to_json(av)
         from "AvatarItems" av
         where av."AvatarKaiScriptId" = ak."id"
         order by "slot" asc
         LIMIT 1
       ))) "AvatarItems"
  from "AvatarKaiScripts" as ak where "isTeamMember" = true and "AvatarId" = ${id} order by "teamOrder" asc limit 5;
