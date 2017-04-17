update "AvatarItems"
set "isEquipped" = false, "equippedAt" = NULL, "slot" = null
where id = ${id} and "AvatarId" = ${avatarId};
