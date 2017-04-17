update "AvatarItems"
set "isEquipped" = true, "equippedAt" = CURRENT_TIMESTAMP, "slot" = ${slot}
where id = ${id} and "AvatarId" = ${avatarId} and "isEncrypted" = false
