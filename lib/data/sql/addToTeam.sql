update "AvatarKaiScripts"
set "isTeamMember" = true,
"teamOrder" = (select count(*) from "AvatarKaiScripts" where "AvatarId" = ${id} and "isTeamMember" = true)
where "AvatarId" = ${id} and id = ${kaiScriptId} and (select count(*) from "AvatarKaiScripts" where "AvatarId" = ${id} and "isTeamMember" = true) < 5;
