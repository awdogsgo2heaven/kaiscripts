update "AvatarKaiScripts"
set health = ${health},
statuses = ${statuses}::jsonb
where id = ${id} and "AvatarId" = ${avatarId};
