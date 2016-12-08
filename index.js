require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const stickers = require("./lib/aliases.js");

bot.on("message", message => {
  const prefix = "!";

  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  const command = message.content.substring(1);
  if (stickers.hasOwnProperty(command)) {
    message
    .delete()
    .then(message => {
      const text = `${message.author} just sent the sticker ${command}`;
      message.channel.sendFile(stickers[command], "", text);
      return;
    })
    .catch(console.error);
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