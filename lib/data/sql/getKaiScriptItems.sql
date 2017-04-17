select *, count(*) OVER() AS "fullCount"  from "AvatarItems"
where "AvatarId" = ${avatarId} and "AvatarKaiScriptId" = ${avatarKaiScriptId} and "itemType" = ${itemType}
offset ${offset} limit ${limit};
