--SELECT "DeleteFunction"('BuyItem'::text);

CREATE OR REPLACE FUNCTION "BuyItem"(
  avatar_id integer,
  amount integer,
  item_symbol varchar(255)
)
RETURNS TABLE (
  "coins" integer
)
AS
$$

BEGIN

INSERT INTO "AvatarItems" ("item", "createdAt", "updatedAt", "AvatarId", "itemType")
values(item_symbol, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, avatar_id, 'none' );

UPDATE "Avatars"
   SET "coins" = "coins" + amount
WHERE id = avatar_id
returning coins;

END;
$$
LANGUAGE 'plpgsql'
