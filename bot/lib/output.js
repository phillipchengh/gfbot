module.exports = (() => {
  const roll = require("./roll");

  const formatDraw = (draw) => {
    return `[${draw.rarity}][${draw.name}] ${draw.drop_rate}% ${draw.incidence === 1 ? "rate up" : ""}`;
  };

  const formatTenPart = (draws) => {
    let rows = "";
    draws.forEach((draw) => {
      rows += `${formatDraw(draw)}\n`
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