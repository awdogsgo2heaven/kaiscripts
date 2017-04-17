
with d as (update "AccountDevices"
  set "lastSignInAt" = CURRENT_TIMESTAMP,
  "lastNetAccess" = ${ip}::INET
where "AccountId" = ${id} and "device" = ${device}
returing device
),
a as (update "Accounts"
  set "signIns" = "signIns" + 1,
   "attempts" = 0,
   "signInAt" = CURRENT_TIMESTAMP
where "id" = ${id}
returning *)

select *, (select device from d) as device from a;
