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
    const output = `\`\`\`Markdown\nTen Roll\n========\n\n${rows}\`\`\``;
    return output;
  };

  const formatSingle = (draw) => {
    const row = formatDraw(draw);
    const output = `\`\`\`Markdown\nSingle Roll\n===========\n\n${row}\`\`\``;
    return output;
  };

  return {
    tenPart: () => {
      return roll.tenPart()
      .then(formatTenPart);
    },

    single: (gacha) => {
      return roll.single()
      .then(formatSingle);
    }
  };

})();