select lower(state.name) as region, lower(country.name) as country, lower(city.name) as city, city.id as "cityId" from
(SELECT osm_id, name
  FROM public.planet_osm_point where place = 'city' or place = 'town' order by way <-> ST_SetSRID(ST_POINT( ${lon}, ${lat} ), 4326) limit 1) as city(id, name),
(SELECT osm_id, name
  FROM public.planet_osm_polygon where admin_level = '4' and boundary = 'administrative' order by way <-> ST_SetSRID(ST_POINT( ${lon}, ${lat} ), 4326) limit 1) as state(id, name),
(SELECT osm_id, name
  FROM public.planet_osm_polygon where admin_level = '2' and boundary = 'administrative' order by way <-> ST_SetSRID(ST_POINT( ${lon}, ${lat} ), 4326) limit 1) as country(id, name)
