module.exports = (TOKEN) => {
  const eris = require("eris");
  const bot = new eris(TOKEN);
  const stickers = require("./lib/stickers");
  const {sparkAsync, starLegendAsync, tenPartAsync, singleAsync, stickerMessage} = require("./lib/output");
  const {prefix} = require("./config");
  const log = require("./lib/log");
  const cloudinary = require("cloudinary");

  const replyRoll = (message, rollAndOutput) => {
    rollAndOutput(message)
    .then((reply) => {
      return bot.createMessage(message.channel.id, reply);
    })
    .catch((e) => {
      log.error(e, {message: message});
      return bot.createMessage(message.channel.id, "gfbot exploded :thinking:");
    });
  };

  const replyIfSticker = (message) => {
    const command = message.content.split(" ")[0].substring(1).toLowerCase();
    stickers.getAsync(command)
    .then((url) => {
      if (url === null) return;
      return bot.createMessage(message.channel.id, {content: stickerMessage(message), attachment: {type: "image", image: {url: url}}});
      // return message.channel.sendFile(url, "", stickerMessage(message));
    })
    .catch((e) => {
      log.error(e, {message: message});
      return bot.createMessage(message.channel.id, "gfbot exploded :thinking:");
    });
  };

  bot.on("messageCreate", message => {
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

    if (message.content.startsWith(`${prefix}stickers`)) {
      return message.channel.sendFile(cloudinary.url("stickers.jpg"));
    }

    if (message.content.startsWith(`${prefix}roll`)) {
      const number = Math.floor(Math.random() * 100) + 1;
      const name = message.author.nickname ? message.author.nickname : message.author.name;
      return message.channel.sendMessage(`${name} rolled a ${number}`);
    }
    
    return replyIfSticker(message);
  });

  bot.connect();
};