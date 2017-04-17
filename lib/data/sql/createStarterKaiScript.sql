with myid as (insert into "AvatarKaiScripts" (name, health, "isTeamMember", "teamOrder", base, "trait","attacks","createdAt", "updatedAt", "AvatarId")
values (${name}, 0, true, 1, ${base}, ${trait}, ${attacks}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${avatarId})
returning id);
