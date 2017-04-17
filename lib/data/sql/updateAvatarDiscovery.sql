update "Avatars"
  set "GeoDiscoveryId" = ${geoDiscoveryId},
  "discoveryAt" = CURRENT_TIMESTAMP
where id = ${id}
