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

    if (message.content.startsWith(`${prefix}diceroll`)) {
      const number = Math.floor(Math.random() * 6) + 1;
      return message.channel.sendMessage(`${message.author} rolled a ${number}`);
    }    

    if (message.content.startsWith(`${prefix}coinflip`)) {
      const coin = (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
      return message.channel.sendMessage(`${message.author} flipped a ${coin}`);
    }

    if (message.content.startsWith(`${prefix}8ball`)) {
      var responses = ['It is certain.', 'It is decidedly so', 'Without a doubt.',
                        'Yes, definitely.', 'You may rely on it.', 'As I see it, yes.',
                        'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
                        'Reply hazy try again.', 'Ask again later.', 'Better not tell you now.',
                        'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.',
                        'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful'];
      const question = message.content.substr(message.content.indexOf(" ") + 1);
      if (question === "!8ball") {
        return message.channel.sendMessage(`Ask the Magic 8 Ball a question ${message.author}`);
      }
      const response = responses[Math.floor(Math.random() * responses.length)];
      message.channel.sendMessage(`${message.author} asked the Magic 8 Ball: ${question}`);
      return message.channel.sendMessage(`The Magic 8 Ball says: ${response}`);
    }
    
    return replyIfSticker(message);
  });

  bot.on("disconnect", (msg, code) => {
    log.disconnect({msg: msg, code: code});
    process.exit();
  });

  bot.login(TOKEN);
};
