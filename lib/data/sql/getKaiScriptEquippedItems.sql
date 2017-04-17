select *, count(*) OVER() AS "fullCount" from "AvatarItems"
where "AvatarId" = ${avatarId} and "AvatarKaiScriptId" = ${kaiScriptId} and "isEquipped" = true and "itemType" = ${itemType}
