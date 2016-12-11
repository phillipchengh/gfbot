module.exports = (() => {
  const Promise = require("bluebird");
  Promise.promisifyAll(require("redis"));
  const redis = require("redis").createClient();

  return {
    getAsync: (command) => {
      return redis.hgetAsync("stickers", command);
    }
  };

})();