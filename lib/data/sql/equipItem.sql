update "AvatarItems"
set "isEquipped" = true, "equippedAt" = CURRENT_TIMESTAMP, "slot" = ${slot}, "AvatarKaiScriptId" = ${avatarKaiScriptId}
where id = ${id} and
"AvatarId" = ${avatarId}