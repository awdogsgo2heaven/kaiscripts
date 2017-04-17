import {ICoord, ITile} from './common';
import * as turf from 'turf';


export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
};
export function rand(low: number, high: number) {
  return Math.floor(Math.random() * (high - low + 1) + low);
};
export function roll() {
  return this.rand(0, 100) / 100.0;
};



export function randGeoPoint(feature: GeoJSON.Feature<GeoJSON.Polygon>): GeoJSON.Feature<GeoJSON.Point> {
  var bbox = turf.bbox(feature);
  var points = turf.random('points', 1, {
    bbox: bbox
  });

  if (turf.inside(points.features[0], feature)) {
    return points.features[0];
  }
  return randGeoPoint(feature);
}
/** OSM Wiki **/
const meters = 20037508.342789244;
const full_meters = meters * 2;
export function long2tile(lon, zoom) {
  var x = lon * (meters / 180);

  return Math.floor((x + meters) / (full_meters / Math.pow(2, zoom)));
}

export function latLngToMeters([x, y]) {

    // Latitude
    y = Math.log(Math.tan(y*Math.PI/360 + Math.PI/4)) / Math.PI;
    y *= meters;

    // Longitude
    x *= meters / 180;

    return [x, y];
};

export function metersToLatLng([x, y]) {

    x /= meters;
    y /= meters;

    y = (2 * Math.atan(Math.exp(y * Math.PI)) - (Math.PI / 2)) / Math.PI;

    x *= 180;
    y *= 180;

    return [x, y];
};

export function tileSize(zoom) {
  return full_meters/Math.pow(2, zoom);
}
export function lat2tile(lat, zoom) {

  var y = Math.log(Math.tan(lat * Math.PI / 360 + Math.PI / 4)) / Math.PI;
  y *= meters;

  return Math.floor((-y + meters) / (full_meters / Math.pow(2, zoom)));

}

export function distance(point: GeoJSON.Feature<GeoJSON.Point>, feature: GeoJSON.Feature<GeoJSON.GeometryObject>) {
  if (feature.geometry.type === 'Point')
    return turf.distance(point, feature as GeoJSON.Feature<GeoJSON.Point>, 'miles');
  else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {

    if (turf.inside(point, feature as GeoJSON.Feature<GeoJSON.Polygon>)) {
      console.log('inside');
      return 0;
    }
    var vertices = turf.explode(feature)
    var closestVertex = turf.nearest(point, vertices)
    return turf.distance(point, closestVertex, 'miles')
  }
  else if (feature.geometry.type === 'LineString') {
    var vertices = turf.explode(feature)
    var closestVertex = turf.nearest(point, vertices)
    return turf.distance(point, closestVertex, 'miles')
  }
  return 9999;
}
// export function long2tile(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }
// export function lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }

export function tile2coord(tile: ITile, zoom: number = 18): ICoord {
  var x = tile.x * full_meters / Math.pow(2, zoom) - meters;
  var y = -(tile.y * full_meters / Math.pow(2, zoom) - meters);
  x /= meters;
  y /= meters;

  y = (2 * Math.atan(Math.exp(y * Math.PI)) - (Math.PI / 2)) / Math.PI;

  x *= 180;
  y *= 180;

  return {
    lat: y,
    lon: x,
    createdAt: Date.now()
  }
}

export function tile2lat(y, z) {
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}
