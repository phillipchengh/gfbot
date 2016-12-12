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
    redis.lindexAsync("gachas", 0)
    .then((data) => {
      if (data !== null) {
        const gacha = JSON.parse(data);
        // same gacha ?
        if (gacha.meta.current_page_gacha_id === req.body.current_page_gacha_id) {
          return res.send("seems to be the same");
        } else {
          redis.lpush("gachas", parse.gacha(req.body)); 
          return res.send("appended new gacha")
        }
      } else {
        redis.lpush("gachas", parse.gacha(req.body));
        return res.send("newly added");
      }
    })
    .catch((e) => {
      return res.send("failed to add gacha");
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