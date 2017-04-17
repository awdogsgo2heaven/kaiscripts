with item AS (DELETE FROM ONLY "AvatarItems" where id = ${id} and "AvatarId" = ${avatarId} returning *)
insert into "AvatarItemsArchive" ("item", "itemType", "createdAt", "updatedAt", "deletedAt", "AvatarId")
select item.item, item."itemType", item."createdAt", item."updatedAt", CURRENT_TIMESTAMP, item."AvatarId" from item;
