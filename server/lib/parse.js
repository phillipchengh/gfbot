module.exports = (() => {
  const parseAppear = (items, rarity) => {
    let total_rate = 0;
    const result = {
      items: [] 
    };

    items.forEach((item) => {
      let rate = +parseFloat(item.drop_rate).toFixed(3);
      total_rate += rate;
      result.items.push({
        "name": item.name.trim(),
        "drop_rate": rate,
        "cum_rate": +total_rate.toFixed(3),
        "attribute": (item.attribute === null) ? null : parseInt(item.attribute),
        "kind": (item.kind === null) ? null : parseInt(item.kind),
        "incidence": (item.incidence === null) ? null : parseInt(item.incidence),
        "rarity": rarity
      });
    });

    result.total_rate = +total_rate.toFixed(3);

    return result;
  };

  const parseGacha = (body) => {
    const gacha = {};

    gacha.meta = {
      "type": body.type,
      "random_key": body.random_key,
      "enable_free_legend_10": body.enable_free_legend_10,
      "current_page_gacha_id": body.current_page_gacha_id,
      "created": Date.now()
    };

    gacha.ratio = {
      "SSR": parseFloat(body.ratio[0].ratio.slice(0, -1)),
      "SR": parseFloat(body.ratio[1].ratio.slice(0, -1)),
      "R": parseFloat(body.ratio[2].ratio.slice(0, -1))
    };

    gacha.ratio.total = +(gacha.ratio.SSR + gacha.ratio.SR + gacha.ratio.R).toFixed(3);

    gacha.items = {
      "SSR": {
        "weapons": parseAppear(body.appear[0].item, "SSR"),
        "summons": parseAppear(body.appear[1].item, "SSR")
      },
      "SR": {
        "weapons": parseAppear(body.appear[2].item, "SR"),
        "summons": parseAppear(body.appear[3].item, "SR")
      },
      "R": {
        "weapons": parseAppear(body.appear[4].item, "R"),
        "summons": parseAppear(body.appear[5].item, "R")
      }
    };

    gacha.items.SSR.total_rate = +(gacha.items.SSR.weapons.total_rate + gacha.items.SSR.summons.total_rate).toFixed(3);
    gacha.items.SR.total_rate = +(gacha.items.SR.weapons.total_rate + gacha.items.SR.summons.total_rate).toFixed(3);
    gacha.items.R.total_rate = +(gacha.items.R.weapons.total_rate + gacha.items.R.summons.total_rate).toFixed(3);

    return JSON.stringify(gacha);
  };

  return {
    gacha: (body) => {
      return parseGacha(body);
    }
  };

})();