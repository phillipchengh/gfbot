module.exports = (() => {
  const roll = require("./roll");
  const moment = require("moment");

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

  const ago = (created) => {
    return moment().subtract(moment().diff(created)).fromNow();
  };

  const formatTenPart = (output, message) => {
    const draws = output.draws;
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
    return `\`\`\`Markdown\n${name}'s Ten Roll\n${equals}===========\nGacha last updated ${ago(output.created)}\n\n${rows}\`\`\``;
  };

  const formatSingle = (output, message) => {
    const draw = output.draw;
    const row = formatDraw(draw);
    const name = message.member.nickname;
    const equals = "=".repeat(name.length);
    return `\`\`\`Markdown\n${name}'s Single Roll\n${equals}==============\nGacha last updated ${ago(output.created)}\n\n${row}\`\`\``;
  };

  const formatStickerMessage = (message) => {
    return `${message.author} sent a sticker!`;
  };

  return {
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

    stickerMessage: (message) => {
      return formatStickerMessage(message);
    }
  };

})();