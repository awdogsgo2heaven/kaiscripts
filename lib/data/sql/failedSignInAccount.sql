
--lock out for 30 seconds after 4 failed attempts
update "Accounts"
  set "attempts" = attempts + 1,
  "isLocked" = case when attempts > 4 then true else false end,
  "unlockAt" = case when attempts > 4 then (CURRENT_TIMESTAMP + interval '30 second') else null end
where "id" = ${id}
returning "attempts", "isLocked", "unlockAt";
