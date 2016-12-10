module.exports = (TOKEN) => {
  const discord = require("discord.js");
  const bot = new discord.Client();
  const stickers = require("./lib/aliases.js");
  const output = require("./lib/output");

  const rollReply = (message, rollAndOutput) => {
    rollAndOutput()
    .then((reply) => {
      return message.channel.sendMessage(reply);
    })
    .catch((e) => {
      return message.channel.sendMessage("gfbot exploded");
    });
  };

  bot.on("message", message => {
    const prefix = "!";

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    const command = message.content.split(" ")[0].substring(1).toLowerCase();
    if (stickers.hasOwnProperty(command)) {
      const text = `${message.author} sent a sticker!`;
      message.channel.sendFile(stickers[command], "", text);
      return;
    }

    if (message.content.startsWith(prefix + "buyinggf")) {
      return rollReply(message, output.tenPart);
    }

    if (message.content.startsWith(prefix + "memeroll")) {
      return rollReply(message, output.single);
    }

    if (message.content.startsWith(prefix + "stickerlist")) {
      let text =  "";
      Object.keys(stickers).forEach(alias => {
        text += alias + "\n";
      });
      message.channel.sendMessage(text);
      return;
    }

  });

  bot.on("disconnect", (msg, code) => {
    console.log(`bot disconnected with code ${code} for reason ${msg}`);
    console.log(`bot reconnecting...`);
    bot.connect();
  });

  bot.login(TOKEN);
};