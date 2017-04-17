update "AvatarKaiScripts"
set "isTeamMember" = false,
"teamOrder" = null
where "AvatarId" = ${id} and id = ${kaiScriptId} and (select count(*) from "AvatarKaiScripts" where "AvatarId" = ${id} and "isTeamMember" = true) > 1;
