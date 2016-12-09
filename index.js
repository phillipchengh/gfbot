require("dotenv").config();
console.log(`running environment in ${process.env.NODE_ENV}...`);
const TOKEN = process.env.NODE_ENV === "development" ? process.env.DISCORD_TOKEN_DEV : process.env.DISCORD_TOKEN;
require("./bot")(TOKEN);
require("./server")();