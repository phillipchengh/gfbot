module.exports = () => {
  const app = require("express")();
  const bodyParser = require("body-parser");
  const roll = require("../bot/lib/roll");
  const Promise = require("bluebird");
  Promise.promisifyAll(require("redis"));
  const redis = require("redis").createClient();
  const parse = require("./lib/parse");
  app.use(bodyParser.json());

  app.get("/draw/premium/get", (req, res) => {
    redis.lindexAsync("gachas", 0)
    .then((data) => {
      if (data === null) {
        return res.send("?");
      }
      return res.send(data);
    })
    .catch((e) => {
      return res.send("failed to get gacha");
    });
  });

  app.post("/draw/premium/add", (req, res) => {
    let characters;
    redis.hgetallAsync("characters")
    .then((data) => {
      characters = data;
      return redis.lindexAsync("gachas", 0);
    })
    .then((data) => {
      if (data !== null) {
        const gacha = JSON.parse(data);
        // same gacha ?
        if (gacha.meta.current_page_gacha_id === req.body.current_page_gacha_id) {
          return res.send("seems to be the same");
        } else {
          redis.lpush("gachas", parse.gacha(req.body, characters)); 
          return res.send("appended new gacha")
        }
      } else {
        redis.lpush("gachas", parse.gacha(req.body, characters));
        return res.send("newly added");
      }
    })
    .catch((e) => {
      console.log(e);
      return res.send("failed to add gacha");
    });
  });

  // mostly for testing but a bunch of this is so lmao
  app.post("/draw/premium/update", (req, res) => {
    let gacha;
    redis.lindexAsync("gachas", 0)
    .then((data) => {
      if (data === null) throw new Error("could not get gacha");
      gacha = JSON.parse(data);
      gacha = data;
      return redis.hgetallAsync("characters");
    })
    .then((data) => {
      if (data === null) throw new Error("could not get characters");
      characters = data;
      parse.updateGacha(gacha, characters);
      return redis.lsetAsync("gachas", 0, JSON.stringify(gacha));
    })
    .then((data) => {
      res.send(gacha);
    })
    .catch((e) => {
      console.log(e);
      return res.send("failed to add gacha");
    });
  });

  app.get("/characters/get", (req, res) => {
    redis.hgetallAsync("characters")
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
  });

  app.post("/characters/import", (req, res) => {
    const characters = req.body;
    const hsets = []; 
    for (weapon in characters) {
      hsets.push(redis.hsetAsync("characters", weapon, characters[weapon]));
    }
    Promise.all(hsets)
    .then(() => {
      return redis.hgetallAsync("characters");
    })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.send("eh");
    });
  });

  app.post("/characters/add", (req, res) => {
    const characters = parse.characters(req.body);
    const hsets = []; 
    characters.forEach((character) => {
      let weapon = character.weapon;
      let name = character.name;  
      hsets.push(redis.hsetAsync("characters", weapon, name));
    });
    Promise.all(hsets)
    .then(() => {
      return redis.hgetallAsync("characters");
    })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.send("huh");
    });
  });

  app.get("/draw/single", (req, res) => {
    roll.singleAsync()
    .then((draw) => {
      res.send(draw);
    })
    .catch((e) => {
      console.error(e);
      res.send("failed to draw single");
    });
  });

  app.get("/draw/ten_part", (req, res) => {
    roll.tenPartAsync()
    .then((draws) => {
      res.send(draws);
    })
    .catch((e) => {
      console.error(e);
      res.send("failed to draw ten part");
    });
  });

  app.listen(1337, () => {
    console.log("listening on port 1337...");
  });

};
