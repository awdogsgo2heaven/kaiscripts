import * as express from 'express';
import {logger} from '../lib/helpers/logger';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import {BadRequestError, NotFoundError, ValidationError, ServerError, UnauthorizedError} from '../lib/errors';
import * as passport from 'passport';
import {Strategy, IStrategyOptions, IVerifyOptions} from 'passport-local';
import * as SocketIO from 'socket.io';
import * as redis from 'socket.io-redis';
import routes from './routes';
import * as SocketRouter from './config/socket';
import * as path from 'path';
import * as pg from 'pg-promise';
import * as validators from '../lib/helpers/validators';
import * as auth from '../lib/auth';
var redisConfig = require('../lib/config/redis');
var app = express();
var server = http.createServer(app);

var io = SocketIO(server, {
  transports: [
    'websocket',
    'polling'
  ]
});
//io.set('transports', ['websocket']);
io.adapter(redis({ host: redisConfig.host , port: redisConfig.port }));

SocketRouter.configure(io);
//app.set('port', process.env.PORT || 9000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));

// Add headers
app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Device-ID');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {

  var device = req.get('X-Device-ID');

  if (validators.uuid(device)) {
    req.device = device;
  }

  next();
});

app.use(passport.initialize());
app.use('/auth', auth);
app.use(passport.session())

app.use(function(req, res, next) {
  req.io = io;
  next();
});
// app.use(function promiseify(request, response, next) {
//     response.promise = function(promise) {
//         promise.catch(next);
//     }
//
//     next();
// });

routes(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  res.sendStatus(404);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     console.log('found error')
//     if (err instanceof ServerError) {
//       res.sendStatus(err.code);
//     }
//     else if (err instanceof ValidationError) {
//       res.sendStatus(422);
//     }
//
//     else {
//       res.sendStatus(500);
//     }
//   });
// }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('found error')
  if (err instanceof ServerError) {
    console.log(err.code);
    res.status(err.code).json(err.message);
    logger.error(err);
  }
  else if (err instanceof ValidationError) {
    res.sendStatus(422);
    logger.error(err);
  }
  else if (err instanceof UnauthorizedError)
    // else if (err instanceof DatabaseError) {
    res.sendStatus(401);
  //   //logger.error(err);
  // }
  else {
    res.sendStatus(500);
    logger.error(err);
  }
});


// // mongoose
// if(process.env.NODE_ENV == 'development') {
//   mongoose.connect('mongodb://localhost/kaiscripts');
// }
// else {
//   mongoose.connect('mongodb://localhost/kaiscripts_' + process.env.NODE_ENV);
// }

function start() {
  server.listen(8000, function() {
    logger.info('Listening on port 8000.')
  });
}

if (process.env.NODE_ENV == 'test') {
  // models.sequelize.sync({ force: true }).then(function() {
  //   require('config/t-seed.js')(start);
  // });
  start();
}
else {
  start();
}

module.exports = server;
