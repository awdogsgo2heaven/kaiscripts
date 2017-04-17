select * from "GeoDiscoveries" where (category = '*' or category in (${category}))
and ("timeOfDay" = '*' or "timeOfDay" = ${timeOfDay})
and (season = '*' or season = ${season})
and (weather = '*' or weather = ${weather})
and (temp is null or temp = ${temp})
and (country is null or country = ${country})
and (regions is null or regions @> ARRAY[${region}]::varchar[])
and "discoveryType" = ${discoveryType}
order by chance desc
limit 5;
