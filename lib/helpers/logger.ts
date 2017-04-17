
import * as winston from 'winston';
import * as transport from 'winston-cloudwatch';
import * as _ from 'underscore';

export const logger = new (winston.Logger)({

  transports: [
    new (winston.transports.Console)({
      name: 'info-file',
      colorize: true,
      timestamp: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: '/tmp/filelog-error.log',
      timestamp: true,
      tailable: true,
      maxsize: 1000000,
      level: 'error'
    })
  ]
}).add(transport as winston.TransportInstance, {
  logGroupName: 'debug',
  logStreamName: 'default',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY,
  awsSecretKey: process.env.AWS_SECRET_KEY,
  awsRegion: process.env.AWS_REGION
  });

// method for adding stack traces to log: https://gist.github.com/getvega/6211610
// override winston.logger.log to add stacktrace along errors included
// 4 ways to include some errors in a log:
// - logger.warn('message', myError)
// - logger.warn('message', [myError1, myError2])
// - logger.warn('message', { error: myError })
// - logger.warn('message', { errors: [myError1, myError2] })
var _log = logger.log;
logger.log = <any>function() {
  var self     = this,
      errs     = [],
      args     = Array.prototype.slice.call(arguments),
      callback = typeof args[args.length - 1] === 'function' ? args.pop() : null,
      meta     = typeof args[args.length - 1] === 'object' ? args.pop() : {},
      isError  = function(a) { return a instanceof Error };

  // logger.warn('message', myError)
  if (meta) {
    if (meta instanceof Error) {
      errs = [meta];
      meta = {};
      // logger.warn('message', { error: myError })
    } else if (meta.error instanceof Error) {
      errs = [meta.error];
      delete meta.error;
      // logger.warn('message', { errors: [myError1, myError2] })
    } else if (meta.errors && _(meta.errors).every(isError)) {
      errs = meta.errors;
      delete meta.errors;
      // logger.warn('message', [myError1, myError2])
    } else if (_(meta).isArray() && _(meta).every(isError)) {
      errs = meta;
      meta = {};
    }
  

    // finally attach the processed result
    if (errs && errs.length) {
      meta.errors = _(errs).map(function (err) {
        return _(err).pick('name', 'message', 'stack');
      });
      // if no message on the log, compute one from the first error message
      // supports: logger.warn(myError) or logger.warn([myError, myError2, etc...]) or ...
      if (args.length < 2) {
        args.push(meta.errors[0].message);
      }
    }

    args.push(meta);
    if (callback) args.push(callback);
  }
  _log.apply(logger, args);
};
