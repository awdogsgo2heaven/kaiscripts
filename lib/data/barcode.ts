'use strict';
import * as consts from '../config/constants';
import * as pg from 'pg-promise';
import db from './index';
import {BadRequestError, NotFoundError, ValidationError} from '../errors';

const sqlCreateBarcode = new pg.QueryFile('../lib/data/sql/createBarcode.sql', {
  compress: true
});

export interface IBarcodeSql {
  code: string
  standard: string
}

export class Barcode {
  constructor(public data: IBarcodeSql) {

  }

  static async insert(code: string, standard: string) {
    try {
      await db().none(sqlCreateBarcode, {
        code: code,
        standard: standard
      })
    }
    catch (e) {
      if (e.code == '23505') {
        throw new ValidationError('Nothing found');
      }
      else {
        throw e;
      }
    }
  }
}
