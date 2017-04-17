select *, count(*) OVER() AS "fullCount" from "AvatarItems", (select base from "AvatarKaiScripts" where id = ${kaiScriptId}) as t(x)
where "AvatarId" = ${avatarId} and "isEquipped" = false
and "itemType" = ${itemType}
and item in (select item from "WhiteListItems" where "kaiScript" = t.x);
