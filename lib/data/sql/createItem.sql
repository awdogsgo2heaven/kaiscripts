insert into "AvatarItems" ("AvatarId", "item", "itemType", "isAvailable", "createdAt", "updatedAt")
values(${avatarId}, ${item}, ${itemType}, ${isAvailable}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
