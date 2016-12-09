module.exports = (TOKEN) => {
  const discord = require("discord.js");
  const bot = new discord.Client();
  const stickers = require("./lib/aliases.js");
  const output = require("../util/output");
  const Promise = require("bluebird");
  Promise.promisifyAll(require("redis"));
  const redis = require("redis").createClient();

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
      redis.lindexAsync("gachas", 0)
      .then((data) => {
        if (data === null) {
          return message.channel.sendMessage("scrub is missing some data...");
        }
        const results = output.tenPart(JSON.parse(data));
        return message.channel.sendMessage(results);
      })
      .catch((e) => {
        return message.channel.sendMessage("gfbot exploded");
      });
    }

    if (message.content.startsWith(prefix + "memeroll")) {
      redis.lindexAsync("gachas", 0)
      .then((data) => {
        if (data === null) {
          return message.channel.sendMessage("scrub is missing some data...");
        }
        const results = output.single(JSON.parse(data));
        return message.channel.sendMessage(results);
      })
      .catch((e) => {
        return message.channel.sendMessage("gfbot exploded");
      });
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

  bot.login(TOKEN);
};