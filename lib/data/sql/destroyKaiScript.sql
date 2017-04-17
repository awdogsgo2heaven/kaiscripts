with "kaiScript" AS (DELETE FROM "AvatarKaiScripts" where id = ${id} and "AvatarId" = ${avatarId} returning *)
insert into "AvatarKaiScriptsArchive" ("base", "trait", "FirstParentId", "SecondParentId", "createdAt", "updatedAt", "deletedAt", "AvatarId")
select "kaiScript".base, "kaiScript"."trait", "kaiScript"."FirstParentId", "kaiScript"."SecondParentId", "kaiScript"."createdAt", "kaiScript"."updatedAt", CURRENT_TIMESTAMP, "kaiScript"."AvatarId" from "kaiScript";
