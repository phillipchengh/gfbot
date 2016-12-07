const Discord = require("discord.js");
const bot = new Discord.Client();
const stickers = require("./lib/stickers.js");

console.log(stickers);

bot.on("message", message => {
  const prefix = "!";

  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  let command = message.content.substring(1);
  if (stickers.hasOwnProperty(command)) {
    message
    .delete()
    .then(message => {
      let text = `${message.author} just sent a sticker!`;
      message.channel.sendFile(stickers[command], "", text);
    })
    .catch(console.error);
  }

});

bot.login("MjU1OTIxMTE5Mzc3MzU4ODQ4.Cykr7Q.ymG5rKSK6AOKPiW5hCUyYHcCMJA");