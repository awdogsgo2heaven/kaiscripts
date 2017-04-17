import * as Promise from 'bluebird';
var co = require('co');

export function trace(gen) {
  var fn = gen;

  if (gen.length === 4) {
    return function(err, req, res, next) {
      return fn(err, req, res, next).catch(next);
    }
  }

  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};
