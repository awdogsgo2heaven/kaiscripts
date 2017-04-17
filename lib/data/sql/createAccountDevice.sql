insert into "AccountDevices" ("AccountId", "verifyCode", "device", "createdAt", "updatedAt", "lastSignInAt", "lastNetAccess")
  values (${accountId}, ${verifyCode}, COALESCE(${device}, uuid_generate_v4()), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)
returning *;