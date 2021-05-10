const ejs = require('ejs')

class ConfigProcessor {

  static evalStrings(str) {
    return ejs.render(str, {
      env: process.env
    });
  }

  static evalConfigStrings(configObj) {
    if (Array.isArray(configObj)) {
      return configObj.map( x => this.evalConfigStrings(x))
    } else if (configObj instanceof Object) {
      let result = {}
      for (var prop in configObj) {
        result[prop] = this.evalConfigStrings(configObj[prop])
      }
      return result
    } else if (typeof configObj === 'string') {
      return this.evalStrings(configObj)
    } else {
      return configObj
    }
  }
}

module.exports = ConfigProcessor;
