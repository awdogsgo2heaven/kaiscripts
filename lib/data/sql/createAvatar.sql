with myid as (insert into "Avatars" (name, faction, "createdAt", "updatedAt")
values (${name}, ${faction}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
returning id)
update "Accounts"
  set "AvatarId" = (select * from myid limit 1),
  state = ${state}
where id = ${accountId}
