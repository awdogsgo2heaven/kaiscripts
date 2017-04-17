'use strict';

import * as Promise from 'bluebird';

import * as express from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import * as local from './local/passport';
import {Account} from '../data/account';
import {UnauthorizedError} from '../errors';
import * as _ from 'underscore';
const validateJwt = expressJwt({ secret: process.env.JWT_SECRET }) as any;

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated(isVerified: boolean = true) {
  // Validate jwt
  return function(req, res, next) {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    validateJwt(req, res, function(err) {
      if (err) {
        next(new UnauthorizedError(err.toString()));
      }
      //  console.log(req.user)
      Account.findByToken(req.user.token).then(function(user) {
        if (!user) throw new UnauthorizedError('Unauthorized')

        if (isVerified && !req.user.isVerified) {
          throw new UnauthorizedError('Account must be verified to continue')
        }
        var data = _.extend(user.data, req.user);

        req.user = user;
        //if (user.isBanned) return res.status(401).send(`This account was banned on ${user.bannedAt}`);
        next();
      }).catch(function(error) {
        next(new UnauthorizedError(error.toString()));
      });
    });
  }
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(user) {
  var jwtToken = jwt.sign(user.token, process.env.JWT_SECRET, <jwt.SignOptions>{ expiresIn: '2 days' });
  return jwtToken;
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.' });
  var token = signToken(req.user);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}
