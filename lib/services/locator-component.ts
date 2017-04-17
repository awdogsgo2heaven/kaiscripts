'use strict';

import {Account} from '../data/account';

export default class LocatorComponent {
  constructor(public user: Account) {
  }
  getAccount(): Account {
    return this.user;
  }
}
