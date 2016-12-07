require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const stickers = require("./lib/aliases.js");

bot.on("message", message => {
  const prefix = "!";

  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  if (message.content.startsWith(prefix + "stickerlist")) {
    const text =  "";
    Object.keys(stickers).forEach(function(alias) {
      text += alias + "\n";
    });
    message.channel.sendMessage(text);
    return;
  }

  const command = message.content.substring(1);
  if (stickers.hasOwnProperty(command)) {
    message
    .delete()
    .then(message => {
      const text = `${message.author} just sent the sticker ${command}`;
      message.channel.sendFile(stickers[command], "", text);
    })
    .catch(console.error);
  }

});

bot.login(process.env.DISCORD_TOKEN);