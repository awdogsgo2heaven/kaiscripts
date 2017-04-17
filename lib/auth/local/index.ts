'use strict';

import * as express from 'express';
import * as passport from 'passport';

import * as auth from '../auth.service';
import {logger} from '../../helpers/logger';

var router = express.Router();

router.post('/', function(req, res, next) {
  const request = passport.authenticate('local', function(err, user, info) {
    var error = err || info;

    if (error) {
      return next(error);
    }
    var token = auth.signToken(user);
    res.json({ token: token });
  }) as any
  request(req, res, next)
});

router.post('/logout', function(req, res, next) {
  req.logout();
  res.sendStatus(200);
});

export = router;
