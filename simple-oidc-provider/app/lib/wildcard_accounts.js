const assert = require('assert');

class WildcardPasswordAccount {

  constructor(wildcardPassword) {
    this.wildcardPassword = wildcardPassword;
  }

  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims() {
        return {
          sub: id,
          email: id,
          email_verified: true,
        }
      }
    }
  }

  async authenticate(email, password) {
    try {
      assert(password, 'password must be provided');
      assert(email, 'email must be provided');
      let comparePassword = password == this.wildcardPassword;
      assert(comparePassword, 'invalid credentials provided');
      return email;
    } catch (err) {
      return undefined;
    }
  }
}

module.exports = WildcardPasswordAccount;
