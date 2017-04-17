insert into "AvatarParentKaiScripts" (name, base, "createdAt", "updatedAt")
values (${name}, ${base}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) returning id;
