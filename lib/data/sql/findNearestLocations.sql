select *, name, fcode, round(ST_Distance(t.x::geography,the_geom)::numeric/1609.34, 2) as distance, latitude, longitude
from "geoname", (select ST_SetSRID(ST_POINT(${lon}, ${lat}), 4326)) as t(x)
order by the_geom <-> t.x
limit 20;

/*select *, round(ST_Distance(t.x::geography,osm.way)::numeric/1609.34, 2) from 
((select op.name, op.waterway, op.place, op.natural, op.admin_level, op.amenity, op.leisure, op.landuse, op.man_made, op.power_source, op.historic, op.way --, round(ST_Distance(t.x::geography,the_geom)::numeric/1609.34, 2)name, fcode, round(ST_Distance(t.x::geography,the_geom)::numeric/1609.34, 2) as distance, latitude, longitude
from "planet_osm_point" as op)
UNION ALL
(select  ol.name, ol.waterway, ol.place, ol.natural, ol.admin_level, ol.amenity, ol.leisure, ol.landuse, ol.man_made, ol.power_source, ol.historic,  ol.way --, round(ST_Distance(t.x::geography,the_geom)::numeric/1609.34, 2)name, fcode, round(ST_Distance(t.x::geography,the_geom)::numeric/1609.34, 2) as distance, latitude, longitude
from "planet_osm_line" as ol)
UNION ALL
(select  og.name, og.waterway, og.place, og.natural, og.admin_level, og.amenity, og.leisure, og.landuse, og.man_made, og.power_source, og.historic, og.way --, round(ST_Distance(t.x::geography,the_geom)::numeric/1609.34, 2)name, fcode, round(ST_Distance(t.x::geography,the_geom)::numeric/1609.34, 2) as distance, latitude, longitude
from "planet_osm_polygon" as og)) as osm, (select ST_SetSRID(ST_POINT( ${lon}, ${lat} ), 4326)) as t(x)
where osm.admin_level is null and osm.name is not null
order by osm.way <-> t.x
limit 1;*/
