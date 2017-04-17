select *,
ST_AsGeoJSON("homePoint") as "homePoint",
(select count(*) from "AvatarKaiScripts" where "AvatarId" = ac."AvatarId" and "isTeamMember" = true and "health" > 0 limit 5) as surviving,
array_to_json(array((
         SELECT
         row_to_json(av)
         from "Avatars" av
         where av."id" = ac."AvatarId"
         LIMIT 4
       ))) "Avatars",
       case "PrivacyPolicyId" when (select id from "PrivacyPolicies" limit 1) then true else false end as "isPrivacyPolicyValid",
       case "TermsAgreementId" when (select id from "TermsAgreements" limit 1) then true else false end as "isTermsAgreementValid"
from "Accounts" ac where phone = ${phone}
limit 1;
