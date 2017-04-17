select *,
round(ST_Distance(t.x::geography,coordinates)::numeric/1609.34, 2) as distance
from
"WeatherCache" as wc,
 (select ST_SetSRID(ST_POINT( ${lon}, ${lat} ), 4326)) as t(x)
order by wc.coordinates <-> t.x
limit 1;
