var stringer = require('json-stable-stringify');
var murmurhash = require('murmurhash');

export function dry(req, res, data) {
  var jsonString = stringer(data);
  var hash = murmurhash.v3(jsonString);
  if (req.query.hash == null || req.query.hash != hash) {
    res.header('X-Cache-Hash', hash);
    return res.json(data);
  }
  return res.send(204);
}
