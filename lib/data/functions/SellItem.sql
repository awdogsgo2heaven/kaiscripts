--SELECT "DeleteFunction"('SellItem'::text);

CREATE OR REPLACE FUNCTION "SellItem"(
  avatar_id integer,
  amount integer,
  item_id integer
)
RETURNS TABLE (
  "coins" integer
)
AS
$$

BEGIN

DELETE FROM "AvatarItems" where id = item_id;

UPDATE "Avatars"
   SET "coins" = "coins" + amount
WHERE id = avatar_id
returning coins;

END;
$$
LANGUAGE 'plpgsql'
