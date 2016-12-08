require("dotenv").config();
const discord = require("discord.js");
const bot = new discord.Client();
const stickers = require("./lib/aliases.js");

bot.on("message", message => {
  const prefix = "!";

  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  const command = message.content.split(" ")[0].substring(1).toLowerCase();
  if (stickers.hasOwnProperty(command)) {
    const text = `${message.author} sent a sticker!`;
    message.channel.sendFile(stickers[command], "", text);
  }

  if (message.content.startsWith(prefix + "stickerlist")) {
    let text =  "";
    Object.keys(stickers).forEach(alias => {
      text += alias + "\n";
    });
    message.channel.sendMessage(text);
  }

});

console.log(`running environment in ${process.env.NODE_ENV}...`);
const TOKEN = process.env.NODE_ENV === "development" ? process.env.DISCORD_TOKEN_DEV : process.env.DISCORD_TOKEN;
bot.login(TOKEN);