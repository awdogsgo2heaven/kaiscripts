select *
from "GeoDiscoveries",
(select ST_SetSRID(ST_POINT(${lon}, ${lat}), 4326)) as t(x)
order by "gpsLocation" <-> t.x
limit 1;
