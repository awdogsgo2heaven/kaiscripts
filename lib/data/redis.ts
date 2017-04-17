import { createClient } from 'then-redis';
var config = require('../../lib/config/redis');
// Or, use an object config
export const client = createClient({
  host: config.host,
  port: config.port,
  password: config.password
})

export const server = createClient({
  host: config.host,
  port: config.port,
  password: config.password
});

export function key(...args: any[]) {
  return args.join(':');
}
