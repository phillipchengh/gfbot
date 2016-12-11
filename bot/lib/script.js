const Promise = require("bluebird");
Promise.promisifyAll(require("redis"));
const redis = require("redis").createClient();
const aliases = require("./stickers");
let hsets = [];
for (let alias in aliases) {
  let key = `${alias}`;
  let value = aliases[alias];
  hsets.push(redis.hsetAsync("stickers", key, value));
}
Promise.all(hsets)
.then(() => {
  console.log("added all stickers");
  process.exit();
})
.catch(() => {
  console.log(":thinking:");
});
