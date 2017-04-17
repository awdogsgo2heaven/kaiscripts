select *, ST_AsGeoJSON("truCoord") as "truCoord",
ST_AsGeoJSON("virtuCoord") as "virtuCoord"
from "AccountLocations" where ST_DWITHIN("truCoord"::geography, ST_SetSRID(ST_POINT(${lon}, ${lat}), 4326)::geography, ${maxDistance}) limit 1;
