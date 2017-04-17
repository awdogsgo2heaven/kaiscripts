
with a as (insert into "Accounts" (email, "hashedPassword", "allowEmail", provider, role, salt, "PrivacyPolicyId", "TermsAgreementId", "createdAt", "updatedAt")
values(${email}, ${hashedPassword}, ${allowEmail}, 'local', 'user', ${salt}, (select "id" from "PrivacyPolicies" order by version desc limit 1), (select "id" from "TermsAgreements" order by version desc limit 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
returning *),
d as (insert into "AccountDevices" ("AccountId", "verifyCode", "device", "createdAt", "updatedAt", "lastSignInAt", "lastNetAccess")
  values ((select id from a), ${verifyCode}, COALESCE(${device}, uuid_generate_v4()), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${ip}::INET)
returning *)

select *, (select device from d) as device, (select "verifyCode" from d) as "verifyCode" from a;
