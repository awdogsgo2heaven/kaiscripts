update "AccountDevices"
set "verifyCode" = null,
"isVerified" = true,
"verifiedAt" = CURRENT_TIMESTAMP,
"updatedAt" = CURRENT_TIMESTAMP
where "verifyCode" = ${verifyCode}
returning "isVerified";
