import { Account } from '../data/account';
import SmsService from './sms';
import EmailService from './email';
import { logger } from '../helpers/logger';
import * as consts from '../config/constants';
import { ValidationError } from '../errors';

export default class NotificationService {
  constructor() {

  }

  static async sendVerify(account: Account, code: string) {
    
    if (account.isPhone) {
      await SmsService.sendVerify(account.phone, code);
    }
    else {
      await EmailService.sendVerify(account.email, code);
    }
    
    await account.incVerifyNotifyCount();
  }
}