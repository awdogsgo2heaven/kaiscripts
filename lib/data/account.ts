'use strict';

import * as consts from '../config/constants';
import * as _ from 'underscore';
import * as Util from "../helpers";
import * as pg from 'pg-promise';
import db from './index';
import * as crypto from 'crypto';
import { IGeoJSON } from '../helpers/common';
import { IRegionInfo, IDistanceNode } from './tile';
import { IWeatherInfo } from './weather-cache';
import { ICoord } from '../helpers/common';
import { ValidationError, NotFoundError, BadRequestError } from '../errors';
import { IAvatarSql, Avatar } from './avatar';
import * as validators from '../helpers/validators';
import * as redis from './redis';
import NotificationService from '../services/notification';
import { logger } from '../helpers/logger';
import * as shortid from 'shortid';

const sqlFindAccountLocation = new pg.QueryFile('../lib/data/sql/findAccountLocationByCoordinates.sql', {
  compress: true
});

const sqlCreateAccountLocation = new pg.QueryFile('../lib/data/sql/createAccountLocation.sql', {
  compress: true
});

const sqlGetlastKnownLocation = new pg.QueryFile('../lib/data/sql/getLastKnownLocation.sql', {
  compress: true
});

const sqlGetAccountByEmail = new pg.QueryFile('../lib/data/sql/getAccountByEmail.sql', {
  compress: true
});

const sqlGetAccountByPhone = new pg.QueryFile('../lib/data/sql/getAccountByPhone.sql', {
  compress: true
});

const sqlGetAccountDevice = new pg.QueryFile('../lib/data/sql/getAccountDevice.sql', {
  compress: true
});

const sqlGetAccountDeviceCount = new pg.QueryFile('../lib/data/sql/getAccountDeviceCount.sql', {
  compress: true
});

const sqlCreateAccountDevice = new pg.QueryFile('../lib/data/sql/createAccountDevice.sql', {
  compress: true
});

const sqlDestroyAccountDevice = new pg.QueryFile('../lib/data/sql/destroyAccountDevice.sql', {
  compress: true
});

const sqlDestroyAccountDevices = new pg.QueryFile('../lib/data/sql/destroyAccountDevices.sql', {
  compress: true
});

const sqlGetAccount = new pg.QueryFile('../lib/data/sql/getAccount.sql', {
  compress: true
});

const sqlGetLatestTermsOfAgreement = new pg.QueryFile('../lib/data/sql/getLatestTermsOfAgreement.sql', {
  compress: true
});

const sqlGetLatestPrivacyPolicy = new pg.QueryFile('../lib/data/sql/getLatestPrivacyPolicy.sql', {
  compress: true
});

const sqlCreateAccount = new pg.QueryFile('../lib/data/sql/createAccount.sql', {
  compress: true
});

const sqlCreateAccountByPhone = new pg.QueryFile('../lib/data/sql/createAccountByPhone.sql', {
  compress: true
});


const sqlUpdateAccountPassword = new pg.QueryFile('../lib/data/sql/updateAccountPassword.sql', {
  compress: true
});

const sqlUpdateAccountState = new pg.QueryFile('../lib/data/sql/updateAccountState.sql', {
  compress: true
});

const sqlCreateAvatar = new pg.QueryFile('../lib/data/sql/createAvatar.sql', {
  compress: true
});

const sqlIncCheaterScore = new pg.QueryFile('../lib/data/sql/incCheaterScore.sql', {
  compress: true
});

const sqlVerifyAccount = new pg.QueryFile('../lib/data/sql/verifyAccount.sql', {
  compress: true
});

const sqlSignInAccount = new pg.QueryFile('../lib/data/sql/signinAccount.sql', {
  compress: true
});

const sqlFailedSignInAccount = new pg.QueryFile('../lib/data/sql/failedSignInAccount.sql', {
  compress: true
});

const sqlUpdateHomePoint = new pg.QueryFile('../lib/data/sql/updateHomePoint.sql', {
  compress: true
});

export class PrivacyPolicy {
  public id: number
  public version: number
  public policy: string

  constructor(public data: IPrivacyPolicySql) {
    this.id = data.id;
    this.version = data.version;
    this.policy = data.policy;
  }
}

export class TermsOfAgreement {
  public id: number
  public version: number
  public agreement: string

  constructor(public data: ITermsOfAgreementSql) {
    this.id = data.id;
    this.version = data.version;
    this.agreement = data.agreement;
  }
}

export class Account {

  public avatar: Avatar

  constructor(public data: IAccountSql) {
    if (data.Avatars && data.Avatars.length > 0) {
      this.avatar = new Avatar(data.Avatars[0]);
    }
  }

  get id(): number {
    return this.data.id;
  }

  get email(): string {
    return this.data.email;
  }

  get phone(): string {
    return this.data.phone;
  }

  get isPhone(): boolean {
    return !this.data.email
  }

  get role(): string {
    return this.data.role;
  }

  get locations() {
    return this.data.locations;
  }

  get verifyCode(): string {
    return this.data.verifyCode;
  }

  get hashedPassword(): string {
    return this.data.hashedPassword;
  }

  async getRedisState() {
    var state = await redis.client.get(this.id.toString());
    return JSON.parse(state || '{}');
  }

  setRedisState(state) {
    return redis.client.set(this.id.toString(), JSON.stringify(state));
  }

  get provider(): string {
    return this.data.provider;
  }

  get salt(): string {
    return this.data.salt;
  }

  get cheaterScore(): number {
    return this.data.cheaterScore;
  }

  get discoveryDate(): number {
    return this.data.discoveryDate;
  }

  get unlockAt(): number {
    return new Date(this.data.unlockAt).getTime();
  }

  get accessToken(): string {
    return this.data.accessToken;
  }

  get homePoint(): number[] {
    if (this.data.homePoint) {
      var geoJSON = JSON.parse(this.data.homePoint) as IGeoJSON;

      return geoJSON.coordinates;
    }
    return null;
  }

  get homePointUpdatedAt(): number {
    if (this.data.homePointUpdatedAt) {
      return new Date(this.data.homePointUpdatedAt).getTime();
    }
    return null;
  }

  get homePointUpdateAvailableAt(): number {
    
    var date = new Date();
    if (this.homePointUpdateAvailableAt) {
      date.setTime(this.homePointUpdatedAt + consts.HOMEPOINT_DAYS_TIL_RESET * 86400000);
    }  
    return date.getTime();
  }

  get state(): any {
    return this.data.state;
  }

  get pending(): any {
    return this.data.pending;
  }

  get isBanned(): boolean {
    return this.data.isBanned;
  }

  get isLocked(): boolean {
    return this.data.isLocked;
  }

  get isVerified(): boolean {
    return this.data.isVerified;
  }

  get bannedAt(): number {
    return this.data.bannedAt;
  }

  get device(): string {
    return this.data.device;
  }
  get attempts(): number {
    return this.data.attempts;
  }

  get signinAt(): number {
    return this.data.signInAt;
  }

  get allowEmail(): boolean {
    return this.data.allowEmail;
  }

  get surviving(): number {
    return parseInt(this.data.surviving);
  }

  get AvatarId(): number {
    return this.data.AvatarId;
  }

  get token() {
    return {
      'token': this.accessToken,
      'role': this.role,
      'email': this.email,
      'showTerms': this.data.isTermsAgreementValid,
      'showPrivacy': this.data.isPrivacyPolicyValid,
      'device': this.data.device,
      'isVerified': this.data.isVerified
    };
  }

  get isLegal() {
    return !this.data.isTermsAgreementValid || !this.data.isPrivacyPolicyValid
  }

  updatePassword(password: string): Promise<void> {

    validators.password(password);

    //salt
    //encrypt
    var salt = Account.newSalt();
    return db().none(sqlUpdateAccountPassword, { hashedPassword: Account.encryptPassword(password, salt), salt: salt, id: this.id });
  }

  async isHomePointReady() {
    return !(await redis.client.exists(redis.key('homepoint', this.avatar.id)))
  }

  async visitHomePoint() {
    await this.avatar.restoreTeam();
    await redis.client.setex(redis.key('homepoint', this.avatar.id), [3600, ""])
  }

  setHomePoint(lon: number, lat: number) {
    if (Date.now() >= this.homePointUpdateAvailableAt) {
      return db().none(sqlUpdateHomePoint, { id: this.id, lon: lon, lat: lat });
    }
    else {
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var diffDays = Math.round(Math.abs((Date.now() - this.homePointUpdateAvailableAt) / (oneDay)));

      throw new ValidationError(`Must wait ${diffDays} more days before you can reset your Home Point`);
    }
  }

  static verify(code: string) {

    return db().oneOrNone(sqlVerifyAccount, { verifyCode: code }).then((data: any) => {
      if (data) {
        return data.isVerified;
      }
      return false;
    });

  }

  updateState() {
    return db().none(sqlUpdateAccountState, { id: this.id, state: this.state });
  }

  getLastKnownLocation(): ICoord {
    if (this.locations.length > 0) {
      return this.locations[0];
    }
    return null
  }

  async incTravelDistance(distance) {
    return redis.client.incrby(redis.key('distance', this.id), Math.floor(distance * consts.MILES_PER_FOOT));
  }

  async getTravelDistance() {
    const travel = await redis.client.get(redis.key('distance', this.id));
    return parseInt(travel);
  }

  async resetTravelDistance() {
    await redis.client.set(redis.key('distance', this.id), 0);
  }

  async incVerifyNotifyCount() {
    await redis.client.incrby(redis.key('verifySent', this.id), 1);
    return redis.client.send('expire', [redis.key('verifySent', this.id), '86400']);
  }

  async getVerifyNotifyCount() {
    var count = await redis.client.get(redis.key('verifySent', this.id));
    return parseInt(count || '0')
  }
  
  async getVerifyNotifyLife() {
    var count = await redis.client.send('ttl', [redis.key('verifySent', this.id)]);
    return parseInt(count || '0')
  }
  
  async getTravelGoal() {
    var goal = await redis.client.get(redis.key('goal', this.id));
    if (goal) {
      return parseInt(goal);
    }
    return this.resetTravelGoal();
  }

  
  async resetTravelGoal() {
    const goal = Util.rand(0, 250);
    await redis.client.set(redis.key('goal', this.id), goal);
    return goal;
  }

  async isFighting() {
    var state = await this.getRedisState();
    return state.isFighting || false;
  }

  async setIsFighting(fighting: boolean) {
    var state = await this.getRedisState();
    state.isFighting = fighting;
    return this.setRedisState(state);
  }

  async getUserMap() {
    var state = await this.getRedisState();
    return state.map || '';
  }

  async setUserMap(mapData: string) {
    var state = await this.getRedisState();
    state.map = mapData;
    return this.setRedisState(state);
  }

  setStarterSelected() {
    this.state.isStarterSelected = true;
    this.updateState();
  }

  /** Sets the Default Avatar for an Account */
  createDefaultAvatar(name: string, factionName: string): Promise<void> {
    validators.required('Name', name);
    validators.length(name, 10);
    validators.required('Faction', factionName);
    validators.profanity(name);
    validators.spaces(name);

    var factions = _.values(consts.FACTIONS);
  
    if (!factions.indexOf(factionName)) {
      throw new BadRequestError('Invalid faction')
    }

    this.state.isAvatarSelected = true;
    return db().none(sqlCreateAvatar, { accountId: this.id, name: name, faction: factionName, state: this.state });
  }

  async sendVerifyCode() {
    await NotificationService.sendVerify(this, this.verifyCode);
  }
  
  async addDevice(uuid: string = null) {
    return db().oneOrNone(sqlCreateAccountDevice, { accountId: this.id, device: uuid || null, verifyCode: Account.newVerifyCode() });
  }

  async removeDevice(uuid: string = null) {
    return db().none(sqlDestroyAccountDevice, { accountId: this.id, device: uuid });
  }
  
  async removeAllDevices() {
    return db().none(sqlDestroyAccountDevices, { accountId: this.id });
  }
  
  async findDevice(uuid: string) {
    return db().oneOrNone(sqlGetAccountDevice, { device: uuid, accountId: this.id });
  }

  async findDeviceCount(uuid: string) {
    return db().one(sqlGetAccountDeviceCount, { device: uuid, accountId: this.id });
  }

  async authenticate(plainText: string, ipAddress: string, device: string = null) {
    if (Account.encryptPassword(plainText, this.salt) === this.hashedPassword) {

      var accountDevice = null;

      if (device) {
        accountDevice = await this.findDevice(device);
      }

      if (accountDevice == null) {

        const deviceCount = await this.findDeviceCount(device);
        
        if (parseInt(deviceCount.count) >= 5) {
          throw new ValidationError('Unable to authenticate more than 5 devices, please deactivate one first.')
        }
        
        const verifySent = await this.getVerifyNotifyCount();
        
        if (verifySent) {
          if (verifySent > 0) {
            const timeToExpire = verifySent * consts.NOTIFY_EXPIRE_MIN;
            const ttl = await this.getVerifyNotifyLife();
            const elapsed = (86400 - ttl);
            const expiration = 2 * 60;
            const remaining = expiration - elapsed;

            if (elapsed < expiration) {
              throw new ValidationError('You must wait ' + Math.ceil(remaining / 60.0) + ' minutes before verifying a new device.');
            } 
          }
        }
        
        accountDevice = await this.addDevice(device);
        
        this.data.verifyCode = accountDevice.verifyCode;   

        await this.sendVerifyCode();

      }      
      
      this.data.device = accountDevice.device;

      const updates = await db().func('"SignInAccount"', [this.id, Account.newAccessToken(), accountDevice.device, ipAddress], pg.queryResult.one) as IAccountSql;

      _.extend(this.data, updates);

      return true;
    }
    else {
      const updates = await db().one(sqlFailedSignInAccount, { id: this.id }) as IAccountSql;
      _.extend(this.data, updates);

      return false;
    }
  }

  incCheaterScore() {
    return db().none(sqlIncCheaterScore, { id: this.id });
  }

  updateLocation(location: ICoord) {
    this.data.locations.unshift(location)
    if (this.locations.length > 20) {
      this.data.locations = this.locations.slice(0, 20)
    }
    return db().none(sqlCreateAccountLocation, {
      id: this.id,
      locations: JSON.stringify(this.locations)
    });
  }

  static findByToken(token: string): Promise<Account> {
    return db().one(sqlGetAccount, { token: token }).then((data: IAccountSql) => {
      if (data) {
        return new Account(data);
      }
      else {
        throw new NotFoundError();
      }
    });
  }

  static findByEmail(email: string): Promise<Account> {
    return db().any(sqlGetAccountByEmail, { email: email }).then((data: IAccountSql[]) => {
      if (data) {
        return new Account(data[0]);
      }
      else {
        throw new NotFoundError();
      }
    });
  }

  static findByPhone(email: string): Promise<Account> {
    logger.info(email);
    return db().any(sqlGetAccountByPhone, { phone: '+1' + email }).then((data: IAccountSql[]) => {
      if (data) {
        return new Account(data[0]);
      }
      else {
        throw new NotFoundError();
      }
    });
  }
  
  static getLatestTermsOfAgreement(): Promise<TermsOfAgreement> {
    return db().any(sqlGetLatestTermsOfAgreement).then((data: ITermsOfAgreementSql[]) => {
      if (data) {
        return new TermsOfAgreement(data[0]);
      }
      else {
        throw new NotFoundError();
      }
    })
  }

  static getLatestPrivacyPolicy(): Promise<PrivacyPolicy> {
    return db().any(sqlGetLatestPrivacyPolicy).then((data: IPrivacyPolicySql[]) => {
      if (data) {
        return new PrivacyPolicy(data[0]);
      }
      else {
        throw new NotFoundError();
      }
    })
  }

  static newSalt(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  static newAccessToken(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  static newVerifyCode(): string {
    return shortid.generate();
  }

  static encryptPassword(password: string, salt: string): string {
    if (!password || !salt) { return ''; }
    var saltBuff = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, saltBuff, 10000, 64, 'SHA1').toString('base64');
  }

  static register(email: string, phone: string, password: string, allowEmail: boolean, ipAddress: string, device: string = null): Promise<Account> {

    var salt = Account.newSalt();

    var code = Account.newVerifyCode();

    validators.password(password);

    if (email) {
      validators.username(email);
      return db().one(sqlCreateAccount,
        {
          email: email.trim(),
          hashedPassword: Account.encryptPassword(password, salt),
          allowEmail: allowEmail,
          salt: salt,
          verifyCode: code,
          ip: ipAddress,
          device: device
        }).then((data: any) => {
          if (data) {
            return new Account(data)
          }
          else {
            throw new NotFoundError();
          }
        });

    }
    else {
      validators.phone(phone);

      return db().one(sqlCreateAccountByPhone,
        {
          phone: '+1' + phone.trim(),
          hashedPassword: Account.encryptPassword(password, salt),
          allowEmail: allowEmail,
          salt: salt,
          verifyCode: code,
          ip: ipAddress,
          device: device
        }).then((data: any) => {
          if (data) {
            return new Account(data)
          }
          else {
            throw new NotFoundError();
          }
        });

    }

  }

}

export interface IAccountSql {
  id: number
  email: string
  phone: string
  role: string
  verifyCode: string
  hashedPassword: string
  provider: string
  salt: string
  cheaterScore: number
  discoveryDate: number,
  pending: any
  isBanned: boolean
  bannedAt: number
  signInAt: number
  signIns: number
  attempts: number
  accessToken: string
  isLocked: boolean
  isVerified: boolean
  state: any
  device: string
  allowEmail: boolean
  AvatarId: number
  GeoDiscoveryId: number
  unlockAt: number
  Avatars: IAvatarSql[]
  homePoint: string
  homePointUpdatedAt: string,
  isPrivacyPolicyValid?: boolean
  isTermsAgreementValid?: boolean
  surviving: string
  locations: Array<ICoord>
}

export interface ILocationSql {
  coordinates: ICoord,
  features: string[],
  region: IRegionInfo,
  weather: IWeatherInfo,
  time: string,
  createdAt: number
}

export interface ITermsOfAgreementSql {
  id: number
  version: number
  agreement: string
}

export interface IPrivacyPolicySql {
  id: number
  version: number
  policy: string
}
