select *, count(*) OVER() AS "fullCount" from "AvatarItems" where "AvatarId" = ${avatarId} and "itemType" = ${itemType} and "isAvailable" = true limit ${limit} offset ${offset};
