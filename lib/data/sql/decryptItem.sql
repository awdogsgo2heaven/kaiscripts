update "AvatarItems"
set "isEncrypted" = false, "encryptedAt" = NULL
where id = ${id} and "encryptedSecret" = ${secret} returning *;
