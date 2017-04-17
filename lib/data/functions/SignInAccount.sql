SELECT "DeleteFunction"('SignInAccount'::text);

CREATE OR REPLACE FUNCTION "SignInAccount"(account_id integer, access_token varchar(255), anon_device uuid, ip inet)
RETURNS TABLE (
  "signInAt" timestamp with time zone,
  attempts integer,
  "signIns" integer,
  "accessToken" varchar(255),
  "isVerified" boolean
)
AS
$$

DECLARE is_verified boolean;

BEGIN

  update "AccountDevices"
    set "lastSignInAt" = CURRENT_TIMESTAMP,
    "lastNetAccess" = ip
  where "AccountDevices"."AccountId" = account_id and "AccountDevices"."device" = anon_device
  returning "AccountDevices"."isVerified" into is_verified;

  --increment sign in, reset lock out
  return query with a as (update "Accounts"
    set "signIns" = "Accounts"."signIns" + 1,
     "attempts" = 0,
     "signInAt" = CURRENT_TIMESTAMP,
     "accessToken" = access_token
  where "Accounts"."id" = account_id
  returning  "Accounts"."signInAt", "Accounts"."attempts", "Accounts"."signIns", "Accounts"."accessToken")
  select *,
  is_verified as "isVerified"
  from a;
END;
$$
LANGUAGE 'plpgsql'
