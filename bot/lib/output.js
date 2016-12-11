module.exports = (() => {
  const roll = require("./roll");

  const formatDraw = (draw, rarestLength) => {
    let spaces = "";
    let spaceLength = rarestLength - draw.rarity.length;
    switch (spaceLength) {
      case 2:
        spaces = "  ";
        break;
      case 1:
        spaces = " ";
        break;
      default:
        spaces = "";
    }
    return `[${spaces}${draw.rarity} ${draw.kind === null ? "Summ" : "Weap"}][${draw.name}] ${draw.drop_rate}% ${draw.incidence === 1 ? "rate up" : ""}`;
  };

  const formatTenPart = (draws) => {
    let rows = "";
    let rarestLength = 0;
    // first get rarest draw, then format spaces accordingly
    draws.forEach((draw) => {
      rarestLength = (draw.rarity.length > rarestLength) ? draw.rarity.length : rarestLength;
    });
    draws.forEach((draw) => {
      rows += `${formatDraw(draw, rarestLength)}\n`
    });
    return `\`\`\`Markdown\nTen Roll\n========\n\n${rows}\`\`\``;
  };

  const formatSingle = (draw) => {
    const row = formatDraw(draw);
    return `\`\`\`Markdown\nSingle Roll\n===========\n\n${row}\`\`\``;
  };

  const formatStickerMessage = (message) => {
    return `${message.author} sent a sticker!`;
  }

  return {
    tenPartAsync: () => {
      return roll.tenPartAsync()
      .then(formatTenPart);
    },

    singleAsync: () => {
      return roll.singleAsync()
      .then(formatSingle);
    },

    stickerMessage: (message) => {
      return formatStickerMessage(message);
    }
  };

})();