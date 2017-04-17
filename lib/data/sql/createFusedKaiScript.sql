insert into "AvatarKaiScripts" (name, health, "isTeamMember", "teamOrder", base, "trait","attacks", "FirstParentId", "SecondParentId",
"createdAt", "updatedAt", "AvatarId")
values (${name}, ${health}, false, null, ${base}, ${trait}, ${attacks}, ${parent1}, ${parent2}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${avatarId})
returning *;
