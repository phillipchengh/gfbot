module.exports = (() => {
  const roll = require("./roll");

  const formatDraw = (draw, longest) => {
    let raritySpaces = "";
    let nameSpaces = "";
    if (longest) {
      const raritySpacesLength = longest.rarity - draw.rarity.length;
      raritySpaces = " ".repeat(raritySpacesLength);
      const nameSpacesLength = longest.name - draw.name.length;
      nameSpaces = " ".repeat(nameSpacesLength);
    }
    return `[${raritySpaces}${draw.rarity} ${draw.kind === null ? "Summ" : "Weap"}][${draw.name}]${nameSpaces} ${draw.drop_rate.toFixed(3)}% ${draw.incidence === 1 ? "(rate up)" : ""}`;
  };

  const formatTenPart = (draws) => {
    let rows = "";
    const longest = {
      rarity: 0,
      name: 0,
      drop_rate: 0
    };
    // first get rarest draw, then format spaces accordingly
    draws.forEach((draw) => {
      longest.rarity = (draw.rarity.length > longest.rarity) ? draw.rarity.length : longest.rarity;
      longest.name = (draw.name.length > longest.name) ? draw.name.length : longest.name;
      let dropRateLen = draw.drop_rate.toString().length; 
      longest.drop_rate = (dropRateLen > longest.drop_rate) ? dropRateLen : longest.drop_rate;
    });
    draws.forEach((draw) => {
      rows += `${formatDraw(draw, longest)}\n`
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