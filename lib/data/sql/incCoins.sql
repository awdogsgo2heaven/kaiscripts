with trans as (UPDATE "Avatars"
   SET "coins" = "coins" + ${amount}
WHERE id = ${id} returning *)
INSERT INTO "CoinTransactions" (delta, coins, "createdAt", "AvatarId")
values (${amount}, (select coins from trans), CURRENT_TIMESTAMP, ${id});
