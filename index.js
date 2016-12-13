require("dotenv").config();
console.log(`running environment in ${process.env.NODE_ENV}...`);
const TOKEN = process.env.NODE_ENV === "development" ? process.env.DISCORD_TOKEN_DEV : process.env.DISCORD_TOKEN;
require("cloudinary").config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET  
});
require("./bot")(TOKEN);
require("./server")();