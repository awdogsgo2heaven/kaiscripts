select * from "AvatarItems" where "isEquipped" = true and (slot = 'cache1' or slot = 'cache2' or slot = 'cache3' or slot = 'cache4') and "AvatarId" = ${id}
order by "slot" asc
limit 4;
