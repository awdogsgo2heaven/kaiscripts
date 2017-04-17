select
points as "cityPoints",
city,
"cityId",
"region" as region,
"week",
faction,
(select sum(points) from "FactionStatistics" where region = fa.region and faction = fa.faction group by region, faction)::integer as "regionPoints"
from "FactionStatistics" fa
where "cityId" = ${cityId}::varchar(25) and week = extract(epoch FROM CURRENT_TIMESTAMP)::bigint / 604800
group by faction, points, city, "cityId", region, week