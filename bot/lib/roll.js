module.exports = (() => {
  const Promise = require("bluebird");
  Promise.promisifyAll(require("redis"));
  const redis = require("redis").createClient();

  const rget = (gacha, index, start, end) => {
    const mid = Math.floor((start + end) / 2);
    if (gacha[mid].cum_rate <= index && gacha[mid+1].cum_rate >= index) {
      return gacha[mid];
    }
    // index is less than current draw and next draw, search right
    if (gacha[mid].cum_rate <= index) {
      return rget(gacha, index, mid+1, end);
    } else {
    // index is greater than current draw, search left
      return rget(gacha, index, start, mid-1);
    }
  };

  const get = (gacha, index) => {
    // edge cases: check first and last item, to make recursive algorithm easier
    if (gacha[0].cum_rate >= index) return gacha[0];
    const end = gacha.length-1;
    if (gacha[end].cum_rate <= index) return gacha[end];
    return rget(gacha, index, 0, end-1);
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

  const rollAsync = (type) => {
    return redis.lindexAsync("gachas", 0)
    .then((gacha) => {
      return type(JSON.parse(gacha));
    });
  };

  return {
    tenPartAsync: () => {
      return rollAsync(tenPart);
    },

    singleAsync: () => {
      return rollAsync(single);
    }
  };
})();