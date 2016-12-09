module.exports = (() => {
  const roll = require("./roll");

  const formatDraw = (draw) => {
    return `[${draw.rarity}][${draw.name}] ${draw.drop_rate}% ${draw.incidence === 1 ? "rate up" : ""}`;
  };

  return {
    tenPart: (gacha) => {
      const draws = roll.tenPart(gacha);
      let rows = "";
      draws.forEach((draw) => {
        rows += `${formatDraw(draw)}\n`
      });
      let output = `\`\`\`Markdown\nTen Roll\n========\n\n${rows}\`\`\``;
      return output;
    },

    single: (gacha) => {
      const row = formatDraw(roll.single(gacha));
      let output = `\`\`\`Markdown\nSingle Roll\n===========\n\n${row}\`\`\``;
      return output;
    }
  };

})();