select name, round(ST_Distance(t.x::geography,the_geom)::numeric/1609.34, 2) as distance, latitude, longitude, population
from "geoname", (select ST_SetSRID(ST_POINT(${lon}, ${lat}), 4326)) as t(x)
where fcode = 'PPL' and population > 0
order by the_geom <-> t.x
limit 1;
