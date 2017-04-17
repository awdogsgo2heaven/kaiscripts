SELECT *, count(*) OVER() AS "fullCount" from "AvatarKaiScripts"
where name like '%${search#}%' and "AvatarId" = ${avatarId}
order by name asc
limit ${limit} offset ${offset};
