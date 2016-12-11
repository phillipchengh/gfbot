module.exports = (() => {
  const roll = require("./roll");
  const stickers = require("./stickers");

  const formatDraw = (draw) => {
    return `[${draw.rarity}][${draw.name}] ${draw.drop_rate}% ${draw.incidence === 1 ? "rate up" : ""}`;
  };

  const formatTenPart = (draws) => {
    let rows = "";
    draws.forEach((draw) => {
      rows += `${formatDraw(draw)}\n`
    });
    const output = `\`\`\`Markdown\nTen Roll\n========\n\n${rows}\`\`\``;
    return output;
  };

  const formatSingle = (draw) => {
    const row = formatDraw(draw);
    const output = `\`\`\`Markdown\nSingle Roll\n===========\n\n${row}\`\`\``;
    return output;
  };

  const formatSticker = (command) => {

  };

  return {
    tenPart: () => {
      return roll.tenPart()
      .then(formatTenPart);
    },

    single: () => {
      return roll.single()
      .then(formatSingle);
    },

    sticker: (command) => {
      return sticker.hget()
    }
  };

})();