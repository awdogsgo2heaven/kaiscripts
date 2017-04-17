import * as profanityUtil from 'profanity-util';
import {ValidationError} from '../errors';

export function required(field: string, text: string) {
  if (!text) {
    throw new ValidationError(`${field} is required`)
  }
}

export function spaces(text: string) {
  if (text.split(' ').length > 2) {
    throw new ValidationError('Too many spaces.');
  }
}

export function length(text: string, length: number) {
  if (text.length > length) {
    throw new ValidationError(`Must be less than ${length} characters.`);
  }
}

export function uuid(text: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text);
}

export function profanity(text: string) {
  if (profanityUtil.check(text).length > 0) {
    throw new ValidationError('Indecent name');
  }
}

export function password(password: string) {
  if (password === '') {
    throw new ValidationError('Account password invalid.');
  }
  else if (password.trim().length < 7) {
    throw new ValidationError('Password must be at least 7 characters long');
  }
}

export function username(email: string) {
  var emailTest = /.+@.+/

  if (email.trim() === '') {
    throw new ValidationError('Account requires an email address.');
  }
  else if (!emailTest.test(email)) {
    throw new ValidationError('Email address is invalid.');
  }
}

export function phone(phone: string) {
  var emailTest = /^\d{10}$/

  if (phone.trim() === '') {
    throw new ValidationError('Account requires a valid phone number.');
  }
  else if (!emailTest.test(phone)) {
    throw new ValidationError('Phone number is invalid.');
  }
}

export function isPhone(phone: string) {
  var emailTest = /^\d{10}$/

  if (phone.trim() === '') {
    return false;
  }
  else if (!emailTest.test(phone)) {
    return false;
  }
  return true;
}

