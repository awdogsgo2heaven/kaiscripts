'use strict';

import {Account} from '../../../lib/data/account';
import {AvatarKaiScript} from '../../../lib/data/avatar-kai-script';
import * as auth from '../../../lib/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import {ValidationError, BadRequestError} from '../../../lib/errors';
import * as validators from '../../../lib/helpers/validators';
import { logger } from '../../../lib/helpers/logger';

export async function client(req, res) {
  res.json({ version: 1.0, env: 'alpha', state: 'ok' });
};

export async function termsOfAgreement(req, res) {
  var result = await Account.getLatestTermsOfAgreement();
  res.json(result);
};

export async function privacyPolicy(req, res) {
  var result = await Account.getLatestPrivacyPolicy();
  res.json(result);
};

export async function register(req, res) {
  var account = await Account.register(
    req.body.email,
    req.body.phone,
    req.body.password,
    req.body.allowEmail,
    req.connection.remoteAddress,
    req.device
  )
  
  account.sendVerifyCode();

  var token = auth.signToken(account);
  res.json({ token: token });
};

export async function verify(req, res) {
  const isVerified = await Account.verify(req.params.id);
  if (isVerified) {
    res.sendStatus(200);
  }
  else {
    console.log('no found')
    res.sendStatus(404);
  }
};

export async function requestVerify(req, res) {

  var account = req.user;  
  var device = account.findDevice(req.device);
  
  account.data.verifyCode = device.verifyCode;

  const verifySent = await account.getVerifyNotifyCount();

  if (verifySent) {
    if (verifySent > 0) {
      const timeToExpire = verifySent * consts.NOTIFY_EXPIRE_MIN;
      const ttl = await account.getVerifyNotifyLife();
      const elapsed = (86400 - ttl);
      const expiration = 2 * 60;
      const remaining = expiration - elapsed;

      if (elapsed < expiration) {
        throw new ValidationError('You must wait ' + Math.ceil(remaining / 60.0) + ' minutes before requesting another verification email.');
      } 
    }
  }
  
  if (device) {
    await req.user.sendVerifyCode();
    res.sendStatus(200);
  }
  else {
    res.sendStatus(400);
  }
};

export async function removeDevice(req, res) {
  var account = req.user;  
  await account.removeDevice(req.device);
  res.sendStatus(200);
};

export async function removeAllDevices(req, res) {
  var account = req.user;  
  await account.removeAllDevices();
  res.sendStatus(200);
};

export async function createAvatar(req, res) {

  const user = req.user;

  //Check if User has already created his Avatar
  if (user.state.isAvatarSelected) {
    throw new BadRequestError('Invalid State')
  }

  //Set Avatar Info
  await user.createDefaultAvatar(req.body.name, req.body.faction);
  res.sendStatus(200);
};

/** Create a Starter */
export async function createKaiScript(req, res) {

  const user = req.user as Account;
  const symbol = req.body.symbol;
  const name = req.body.name;

  if (user.state.isStarterSelected || !user.state.isAvatarSelected) {
    throw new BadRequestError('Invalid State')
  };

  var kaiScript = await user.avatar.addKaiScript(symbol || 'Carbarkle', name);

  await user.avatar.addTeamMember(kaiScript.id);

  res.sendStatus(200);
};

/**
 * Change a users password
 */
export async function changePassword(req, res, next) {

  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  if (req.user.authenticate(oldPass)) {
    await req.user.updatePassword(newPass);
    res.sendStatus(200);
  } else {
    throw new ValidationError('Unable to validate your current password')
  }
};
