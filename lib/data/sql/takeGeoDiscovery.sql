select *
from "GeoDiscoveries" where id = ${geoDiscoveryId} limit 1;

update "Avatars"
  set "GeoDiscoveryId" = null
where id = ${id};
