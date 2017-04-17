import * as passport from 'passport';
import {Strategy, IStrategyOptions, IVerifyOptions} from 'passport-local';
import {Account} from '../../data/account';
import {UnauthorizedError} from '../../errors';
import * as validators from '../../helpers/validators';

export function setup() {
  passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // this is the virtual field on the model
  },
    function (req: any, email: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) {
      var promise = null;
      if (validators.isPhone(email)) {
        promise = Account.findByPhone(email);
      }
      else {
        promise = Account.findByEmail(email.toLowerCase());
      }
      return promise.then(function(account) {
        if (!account) {
          return done(new UnauthorizedError('This account has not been registered'), false);
        }
        return account.authenticate(password, req.connection.remoteAddress, req.device).then(function(result) {
          if (account.unlockAt > Date.now()) {
            return done(new UnauthorizedError('This account has been locked please wait a bit to try again'), false);
          }
          if (!result) {
            return done(new UnauthorizedError('This password is not correct'), false);
          }
          if (account.isBanned) {
            return done(new UnauthorizedError('This account has been banned'), false);
          }
          done(null, account);
        })
      }).catch(function(error) {
        //console.log(error);
        return done(error);
      });
    }
  ));
};
