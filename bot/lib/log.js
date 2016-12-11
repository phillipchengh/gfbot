module.exports = (() => {
  const moment = require("moment-timezone");

  return {
    error: (e, extra) => {
      console.error(moment().tz("America/Los_Angeles").format());
      console.error(extra);
      console.error(e);
    },

    disconnect: (extra) => {
      console.error(moment().tz("America/Los_Angeles").format());
      console.log(`bot disconnected with code ${extra.code} for reason ${extra.msg}`);
      console.log(`bot reconnecting...`);
    }
  };

})();