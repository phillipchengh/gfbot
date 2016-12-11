module.exports = (TOKEN) => {
  const discord = require("discord.js");
  const bot = new discord.Client();
  const stickers = require("./lib/stickers");
  const output = require("./lib/output");
  const {prefix} = require("./config");

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
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

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

    const command = message.content.split(" ")[0].substring(1).toLowerCase();
    stickers.get(command)
    .then((url) => {
      if (url === null) return;
      return message.channel.sendFile(url, "", `${message.author} sent a sticker!`);
    })
    .catch((e) => {
      return message.channel.sendMessage("gfbot exploded");
    });
  });

  bot.on("disconnect", (msg, code) => {
    console.log(`bot disconnected with code ${code} for reason ${msg}`);
    console.log(`bot reconnecting...`);
    bot.connect();
  });

  bot.login(TOKEN);
};