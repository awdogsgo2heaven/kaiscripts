select *,
ST_AsGeoJSON("homePoint") as "homePoint",
(select count(*) from "AvatarKaiScripts" where "AvatarId" = ac."AvatarId" and "isTeamMember" = true and "health" > 0 limit 5) as surviving,
array_to_json(array((
         SELECT
         row_to_json(av)
         from "Avatars" av
         where av."id" = ac."AvatarId"
         LIMIT 4
       ))) "Avatars"
from "Accounts" ac where ac."accessToken" = ${token}
limit 1;
