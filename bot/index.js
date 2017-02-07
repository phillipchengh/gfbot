module.exports = (TOKEN) => {
  const discord = require("discord.js");
  const bot = new discord.Client();
  const stickers = require("./lib/stickers");
  const {sparkAsync, starLegendAsync, tenPartAsync, singleAsync, stickerMessage} = require("./lib/output");
  const {prefix} = require("./config");
  const log = require("./lib/log");

  const replyRoll = (message, rollAndOutput) => {
    rollAndOutput(message)
    .then((reply) => {
      return message.channel.sendMessage(reply);
    })
    .catch((e) => {
      log.error(e, {message: message});
      return message.channel.sendMessage("gfbot exploded :thinking:");
    });
  };

  const replyIfSticker = (message) => {
    const command = message.content.split(" ")[0].substring(1).toLowerCase();
    stickers.getAsync(command)
    .then((url) => {
      if (url === null) return;
      return message.channel.sendFile(url, "", stickerMessage(message));
    })
    .catch((e) => {
      log.error(e, {message: message});
      return message.channel.sendMessage("gfbot exploded :thinking:");
    });
  };

  bot.on("message", message => {
    if (message.content.match(/^a+y+$/gi)) {
      return message.channel.sendMessage("lmao");
    }

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    if (message.content.startsWith(`${prefix}wailord`)) {
      return replyRoll(message, sparkAsync);
    }

    if (message.content.startsWith(`${prefix}scamlegend`)) {
      return replyRoll(message, starLegendAsync);
    }

    if (message.content.startsWith(`${prefix}buyinggf`)) {
      return replyRoll(message, tenPartAsync);
    }

    if (message.content.startsWith(`${prefix}memeroll`)) {
      return replyRoll(message, singleAsync);
    }

    if (message.content.startsWith(`${prefix}roll`)) {
      const number = Math.floor(Math.random() * 100) + 1;
      return message.channel.sendMessage(`${message.author} rolled a ${number}`);
    }
    
    return replyIfSticker(message);
  });

  bot.on("disconnect", (msg, code) => {
    log.disconnect({msg: msg, code: code});
    process.exit();
  });

  bot.login(TOKEN);
};
