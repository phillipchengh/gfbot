module.exports = (() => {
  const roll = require("./roll");
  const moment = require("moment");

  const formatDraw = (draw, longest) => {
    let raritySpaces = "";
    let nameSpaces = "";
    if (longest) {
      const raritySpacesLength = longest.rarity - draw.rarity.length;
      raritySpaces = " ".repeat(raritySpacesLength);
      const nameSpacesLength = longest.display_name - draw.display_name.length;
      nameSpaces = " ".repeat(nameSpacesLength);
    }
    return `[${raritySpaces}${draw.rarity} ${draw.display_type}][${draw.display_name}]${nameSpaces} ${draw.drop_rate.toFixed(3)}%${draw.incidence === 1 ? " (rate up)" : ""}`;
  };

  const ago = (created) => {
    return moment().subtract(moment().diff(created)).fromNow();
  };

  const formatSparkDraw = (draw, longest) => {
    let raritySpaces = "";
    let nameSpaces = "";
    const nameSpacesLength = longest.display_name - draw.display_name.length;
    nameSpaces = " ".repeat(nameSpacesLength);
    return `[SSR ${draw.display_type}][${draw.display_name}]${nameSpaces} ${draw.drop_rate.toFixed(3)}%${draw.incidence === 1 ? " (rate up)" : ""}`;
  };

  const formatSpark = (output, message) => {
    let rows = "";
    const longest = {
      display_name: 0,
      drop_rate: 0
    };
    let key;
    let draw;
    for (key in output.draws) {
      draw = output.draws[key];
      if (draw.count > 1) {
        draw.display_name = `${draw.display_name}][x${draw.count}`;
      }
      longest.display_name = (draw.display_name.length > longest.display_name) ? draw.display_name.length : longest.display_name;
    }
    for (key in output.draws) {
      draw = output.draws[key];
      rows += `${formatSparkDraw(draw, longest)}\n`
    }
    const name = message.member.nickname ? message.member.nickname : message.author.username;
    const equals = "=".repeat(name.length);
    return `\`\`\`Markdown\n${name}'s Spark\n${equals}========\nGacha last updated ${ago(output.created)}\n\n${rows}\n${output.SSR} SSRs | ${output.SR} SRs | ${output.R} Rs\`\`\``;
  };

  const formatStarLegend = (output, message) => {
    const draws = output.draws;
    let rows = "";
    const longest = {
      rarity: 0,
      display_name: 0,
      drop_rate: 0
    };
    // format spaces
    draws.forEach((draw) => {
      longest.rarity = (draw.rarity.length > longest.rarity) ? draw.rarity.length : longest.rarity;
      longest.display_name = (draw.display_name.length > longest.display_name) ? draw.display_name.length : longest.display_name;
      let dropRateLen = draw.drop_rate.toString().length; 
      longest.drop_rate = (dropRateLen > longest.drop_rate) ? dropRateLen : longest.drop_rate;
    });
    draws.forEach((draw, index) => {
      if (index < 9) {
        rows += `${formatDraw(draw, longest)}\n`;
      }
    });
    rows += `${formatDraw(draws[9], longest)} (scam)`;
    const name = message.member.nickname ? message.member.nickname : message.author.username;
    const equals = "=".repeat(name.length);
    return `\`\`\`Markdown\n${name}'s Star Legend\n${equals}===========\nGacha last updated ${ago(output.created)}\n\n${rows}\`\`\``;
  };

  const formatTenPart = (output, message) => {
    const draws = output.draws;
    let rows = "";
    const longest = {
      rarity: 0,
      display_name: 0,
      drop_rate: 0
    };
    // format spaces
    draws.forEach((draw) => {
      longest.rarity = (draw.rarity.length > longest.rarity) ? draw.rarity.length : longest.rarity;
      longest.display_name = (draw.display_name.length > longest.display_name) ? draw.display_name.length : longest.display_name;
      let dropRateLen = draw.drop_rate.toString().length; 
      longest.drop_rate = (dropRateLen > longest.drop_rate) ? dropRateLen : longest.drop_rate;
    });
    draws.forEach((draw) => {
      rows += `${formatDraw(draw, longest)}\n`
    });
    const name = message.member.nickname ? message.member.nickname : message.author.username;
    const equals = "=".repeat(name.length);
    return `\`\`\`Markdown\n${name}'s Ten Roll\n${equals}===========\nGacha last updated ${ago(output.created)}\n\n${rows}\`\`\``;
  };

  const formatSingle = (output, message) => {
    const draw = output.draw;
    const row = formatDraw(draw);
    const name = message.member.nickname ? message.member.nickname : message.author.username;
    const equals = "=".repeat(name.length);
    return `\`\`\`Markdown\n${name}'s Single Roll\n${equals}==============\nGacha last updated ${ago(output.created)}\n\n${row}\`\`\``;
  };

  const formatEightBallMessage = (message) => {
    var responses = ['It is certain.', 'It is decidedly so.', 'Without a doubt.',
                  'Yes, definitely.', 'You may rely on it.', 'As I see it, yes.',
                  'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
                  'Reply hazy try again.', 'Ask again later.', 'Better not tell you now.',
                  'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.',
                  'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];

    const name = message.member.nickname ? message.member.nickname : message.author.username;

    const question = message.content.substr(message.content.indexOf(" ") + 1);
    if (question === "!8ball") {
      return message.channel.sendMessage(`:8ball: Ask me a question ${name}.`);
    }

    const response = responses[Math.floor(Math.random() * responses.length)];
    return message.channel.sendMessage(`:question: ${question}\n\n:8ball: ${response}`);
  }

  const formatStickerMessage = (message) => {
    return `${message.author} sent a sticker!`;
  };

  return {
    sparkAsync: (message) => {
      return roll.sparkAsync()
      .then((output) => {
        return formatSpark(output, message);
      });
    },

    starLegendAsync: (message) => {
      return roll.starLegendAsync()
      .then((output) => {
        return formatStarLegend(output, message);
      });
    },

    tenPartAsync: (message) => {
      return roll.tenPartAsync()
      .then((output) => {
        return formatTenPart(output, message);
      });
    },

    singleAsync: (message) => {
      return roll.singleAsync()
      .then((output) => {
        return formatSingle(output, message);
      });
    },

    eightBallMessage: (message) => {
      return formatEightBallMessage(message);
    },

    stickerMessage: (message) => {
      return formatStickerMessage(message);
    }
  };

})();