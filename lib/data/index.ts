'use strict';

import * as pgPromise  from 'pg-promise';
import * as bluebird from 'bluebird';

var env = process.env.NODE_ENV || 'development';
var config = require('../../lib/config/database.json');
var geofig = require('../../lib/config/geoname.json');

const pgp = pgPromise({ promiseLib: bluebird });
const instance = pgp(`postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`);
export default function db() {
  return instance;
}
export var geoname = pgp(`postgresql://${geofig.username}:${geofig.password}@${geofig.host}:${geofig.port}/${geofig.database}`)
