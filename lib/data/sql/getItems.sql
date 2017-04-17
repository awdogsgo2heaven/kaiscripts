select *, count(*) OVER() AS "fullCount"  from "AvatarItems"

where "AvatarId" = ${avatarId} and
"itemType" =${itemType}
order by "isEquipped" desc, "slot" desc
offset ${offset} limit ${limit};
