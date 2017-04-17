update "AvatarItems"
set "isEncrypted" = true, "encryptedAt" = CURRENT_TIMESTAMP, "encryptedSecret" = ${secret}
where id = ${id} returning *;
