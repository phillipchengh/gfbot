module.exports = (() => {
  const Promise = require("bluebird");
  Promise.promisifyAll(require("redis"));
  const redis = require("redis").createClient();

  const get = (gacha, index) => {
    let sum = 0;
    if (gacha.length === 0) return null;
    let cur = gacha[0];
    for (let i = 1; i < gacha.length; i++) {
      sum += cur.drop_rate;
      if (index < sum) {
        break;
      }
      cur = gacha[i];
    }
    return cur;
  };

  const rarityRoll = (list) => {
    let index = Math.random() * list.total_rate;
    return (index < list.weapons.total_rate) ? get(list.weapons.items, index) : get(list.summons.items, index - list.weapons.total_rate);
  };

  const tenPart = (gacha) => {
    if (gacha === null) throw new Error("ten part roll: could not get gacha");

    const ratioTotal = gacha.ratio.total;
    const ratioSSR = gacha.ratio.SSR;
    const ratioSR = gacha.ratio.SR;
    const ratioR = gacha.ratio.R;
    const SSR = gacha.items.SSR;
    const SR = gacha.items.SR;
    const R = gacha.items.R;
    const draws = [];

    for (let i = 0; i < 9; i++) {
      let rarity = Math.random() * ratioTotal;
      let draw;

      if (rarity < ratioSSR) {
        draw = rarityRoll(SSR);
      } else if (rarity < ratioSR) {
        draw = rarityRoll(SR); 
      } else {
        draw = rarityRoll(R);
      }

      draws.push(draw);
    }

    // last draw is at least SR
    const rarity = Math.random() * ratioTotal;
    let draw;

    if (rarity < ratioSSR) {
      draw = rarityRoll(SSR);
    } else {
      draw = rarityRoll(SR);
    }
    draws.push(draw);

    return draws;
  };

  const single = (gacha) => {
    if (gacha === null) throw new Error("single roll: could not get gacha");

    const rarity = Math.random() * gacha.ratio.total;
    let draw;

    if (rarity < gacha.ratio.SSR) {
      draw = rarityRoll(gacha.items.SSR);
    } else if (rarity < gacha.ratio.SR) {
      draw = rarityRoll(gacha.items.SR);
    } else {
      draw = rarityRoll(gacha.items.R);
    }

    return draw;
  };

  const roll = (type) => {
    return redis.lindexAsync("gachas", 0)
    .then((gacha) => {
      return type(JSON.parse(gacha));
    });
  };

  return {
    tenPart: () => {
      return roll(tenPart);
    },

    single: () => {
      return roll(single);
    }
  };
})();