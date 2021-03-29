const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');
const assert = require('assert');
const fs = require('fs');
const yaml = require('js-yaml');

assert(process.env.USERS_CONFIG_FILE, 'process.env.USERS_CONFIG_FILE missing');

const db = low(new Memory());
const fileContents = fs.readFileSync(process.env.USERS_CONFIG_FILE, 'utf8');
const config = yaml.safeLoad(fileContents);

db.defaults({
  users: config.users
}).write();

class Account {
  static async findAccount(ctx, id) {
    const account = db.get('users').find({ id }).value();
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

  static async authenticate(email, password) {
    try {
      assert(password, 'password must be provided');
      assert(email, 'email must be provided');
      const lowercased = String(email).toLowerCase();
      const account = db.get('users').find({ email: lowercased, password: password }).value();
      assert(account, 'invalid credentials provided');

      return account.id;
    } catch (err) {
      return undefined;
    }
  }
}

module.exports = Account;
