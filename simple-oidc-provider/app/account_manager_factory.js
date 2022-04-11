const assert = require('assert');
const FileBasedAccount = require('./lib/file_based_accounts');
const WildcardPasswordAccount = require('./lib/wildcard_accounts');

module.exports = {
  getAccountManager: () => {
    let usersConfigFile = process.env.USERS_CONFIG_FILE
    let usersWildcardPassword = process.env.USERS_WILDCARD_PASSWORD
    if (usersConfigFile) {
      return new FileBasedAccount(usersConfigFile)
    } else if (usersWildcardPassword) {
      return new WildcardPasswordAccount(usersWildcardPassword)
    } else {
      throw 'Either USERS_CONFIG_FILE or USERS_WILDCARD_PASSWORD environment variables need to be defined'
    }
  },
}
