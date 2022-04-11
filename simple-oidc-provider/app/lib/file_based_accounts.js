const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');
const assert = require('assert');
const fs = require('fs');
const yaml = require('js-yaml');
const ConfigProcessor = require('../config')

class Account {
  constructor(usersConfigFile) {
    this.db = low(new Memory());
    let fileContents = fs.readFileSync(usersConfigFile, 'utf8');
    let rawConfig = yaml.safeLoad(fileContents);
    this.config = ConfigProcessor.evalConfigStrings(rawConfig)

    this.db.defaults({
      users: this.config.users
    }).write();
  }
  async findAccount(ctx, id) {
    const account = this.db.get('users').find({ id }).value();
    if (!account) {
      return undefined;
    }

    return {
      accountId: id,
      async claims() {
        return {
          sub: id,
          email: account.email,
          email_verified: account.email_verified,
        }
      }
    }
  }

  async authenticate(email, password) {
    try {
      assert(password, 'password must be provided');
      assert(email, 'email must be provided');
      const lowercased = String(email).toLowerCase();
      const account = this.db.get('users').find({ email: lowercased, password: password }).value();
      assert(account, 'invalid credentials provided');

      return account.id;
    } catch (err) {
      return undefined;
    }
  }
}

module.exports = Account;
