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

  const formatTenPart = (draws, message) => {
    let rows = "";
    const longest = {
      rarity: 0,
      name: 0,
      drop_rate: 0
    };
    // format spaces
    draws.forEach((draw) => {
      longest.rarity = (draw.rarity.length > longest.rarity) ? draw.rarity.length : longest.rarity;
      longest.name = (draw.name.length > longest.name) ? draw.name.length : longest.name;
      let dropRateLen = draw.drop_rate.toString().length; 
      longest.drop_rate = (dropRateLen > longest.drop_rate) ? dropRateLen : longest.drop_rate;
    });
    draws.forEach((draw) => {
      rows += `${formatDraw(draw, longest)}\n`
    });
    const name = message.member.nickname;
    const equals = "=".repeat(name.length);
    return `\`\`\`Markdown\n${name}'s Ten Roll\n${equals}===========\n\n${rows}\`\`\``;
  };

  const formatSingle = (draw, message) => {
    const row = formatDraw(draw);
    const name = message.member.nickname;
    const equals = "=".repeat(name.length);
    return `\`\`\`Markdown\n${name}'s Single Roll\n${equals}==============\n\n${row}\`\`\``;
  };

  const formatStickerMessage = (message) => {
    return `${message.author} sent a sticker!`;
  };

  return {
    tenPartAsync: (message) => {
      return roll.tenPartAsync()
      .then((draws) => {
        return formatTenPart(draws, message);
      });
    },

    singleAsync: (message) => {
      return roll.singleAsync()
      .then((draw) => {
        return formatSingle(draw, message);
      });
    },

    stickerMessage: (message) => {
      return formatStickerMessage(message);
    }
  };

})();