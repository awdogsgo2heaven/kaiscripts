select * from "AccountDevices" as ac where ac.device = ${device} and ac."AccountId" = ${accountId} limit 1;