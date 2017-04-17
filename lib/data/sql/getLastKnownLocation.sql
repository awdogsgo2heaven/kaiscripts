select *, ST_AsGeoJSON("truCoord") as "truCoord",
ST_AsGeoJSON("virtuCoord") as "virtuCoord"
from "AccountLocations" where "AccountId" = ${accountId} order by "createdAt" desc limit 1;
