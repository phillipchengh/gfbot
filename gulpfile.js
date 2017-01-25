const gulp = require("gulp");
const gutil = require("gulp-util");
const Promise = require("bluebird");
Promise.promisifyAll(require("fs"));
const fs = require("fs");
Promise.promisifyAll(require("redis"));
const request = require("request");
Promise.promisifyAll(require("request"));
const parse = require("./lib/parse");

gulp.task("ayy", () => {
  gutil.log("lmao");
});

// use --silent for just json to stdout
gulp.task("get_gacha", () => {
  const redis = require("redis").createClient();
  return redis.lindexAsync("gachas", 0)
  .then((data) => {
    if (data === null) throw new Error("redis did not contain any gachas");
    return data;
  })
  // gacha is a string that needs to be parsed
  .then(JSON.parse)
  .then((gacha) => {
    redis.quit();
    return gutil.log(JSON.stringify(gacha, null, 2));
  })
  .catch((e) => {
    gutil.log("Error getting gacha");
    gutil.log(e);
    redis.quit();
  });
});

// use --silent for just json to stdout
gulp.task("get_chars", () => {
  const redis = require("redis").createClient();
  return redis.hgetallAsync("characters")
  .then((data) => {
    if (data === null) throw new Error("redis did not contain any characters");
    return data;
  })
  // characters return as JSON
  .then((chars) => {
    redis.quit();
    return gutil.log(JSON.stringify(chars, null, 2));
  })
  .catch((e) => {
    gutil.log("Error getting characters");
    gutil.log(e);
    redis.quit();
  });
});

// adds new character mappings from granblue's json
gulp.task("add_chars", () => {
  const argv =
  require('yargs')
  .usage("Usage: gulp add_chars -file [file]")
  .demandOption(['file'])
  .argv;

  const redis = require("redis").createClient();
  return fs.readFileAsync(argv.file)
  .then((data) => {
    return data.toString();
  })
  .then((data) => {
    const input = JSON.parse(data);
    const characters = parse.characters(input);
    const hsets = []; 
    characters.forEach((character) => {
      let weapon = character.weapon;
      let name = character.name;  
      hsets.push(redis.hsetAsync("characters", weapon, name));
    });
    return Promise.all(hsets)
  })
  .then((data) => {
    let total = 0;
    data.forEach((count) => {
      total += count;
    });
    gutil.log(`Added ${total} characters`);
    return redis.quit();
  })
  .catch((e) => {
    gutil.log("Error adding characters");
    gutil.log(e);
    redis.quit();
  });
});

// this imports characters from gfbot's json
gulp.task("import_chars", () => {
  const argv =
  require('yargs')
  .usage("Usage: gulp import_chars -file [file]")
  .demandOption(['file'])
  .argv;

  const redis = require("redis").createClient();
  return fs.readFileAsync(argv.file)
  .then((data) => {
    return data.toString();
  })
  .then((data) => {
    const characters = JSON.parse(data);
    const hsets = []; 
    let weapon;
    for (weapon in characters) {
      hsets.push(redis.hsetAsync("characters", weapon, characters[weapon]));
    }
    return Promise.all(hsets);
  })
  .then((data) => {
    let total = 0;
    data.forEach((count) => {
      total += count;
    });
    gutil.log(`Added ${total} characters`);
    return redis.quit();
  })
  .catch((e) => {
    gutil.log(e);
  });
})

// add and switch to new gacha
gulp.task("add_gacha", () => {
  const argv =
  require('yargs')
  .usage("Usage: gulp add_gacha -file [file]")
  .demandOption(['file'])
  .argv;

  const redis = require("redis").createClient();
  let input;
  return fs.readFileAsync(argv.file)
  .then((data) => {
    return data.toString();
  })
  .then((data) => {
    input = JSON.parse(data);
    return redis.lindexAsync("gachas", 0);
  })
  .then((data) => {
    if (data !== null) {
      const gacha = JSON.parse(data);
      // same gacha?
      if (gacha.meta.current_page_gacha_id === input.current_page_gacha_id) {
        throw new Error("New gacha seems to be the same as current gacha");
      }
    }
    return redis.hgetallAsync("characters");
  })
  .then((characters) => {
    redis.lpush("gachas", parse.gacha(input, characters));
    return redis.quit();
  })
  .catch((e) => {
    gutil.log("Error adding gacha");
    gutil.log(e);
    redis.quit();
  });
});

// updates character/display of current gacha
gulp.task("update_gacha", () => {
  const redis = require("redis").createClient();
  let gacha;
  redis.lindexAsync("gachas", 0)
  .then((data) => {
    if (data === null) throw new Error("redis did not contain any gachas");
    gacha = JSON.parse(data);
    return redis.hgetallAsync("characters");
  })
  .then((characters) => {
    if (characters === null) throw new Error("redis did not contain any characters");
    parse.updateGacha(gacha, characters);
    redis.lset("gachas", 0, JSON.stringify(gacha));
    return redis.quit();
  })
  .catch((e) => {
    gutil.log("Error updating gacha");
    gutil.log(e);
    redis.quit();
  });
});

// set sticker
gulp.task("add_sticker", () => {
  const argv =
  require('yargs')
  .usage("Usage: gulp add_sticker -alias [alias] -url [url]")
  .demandOption(['alias', 'url'])
  .argv;

  const redis = require("redis").createClient();
  return request.headAsync(argv.url)
  .then((res) => {
    if (!res.headers['content-type'].match(/image/)) throw new Error("URL content-type did not match image");
    return redis.hsetAsync("stickers", argv.alias, argv.url);
  }) 
  .then((data) => {
    gutil.log(`Added ${data} sticker`);
    return redis.quit(); 
  })
  .catch((e) => {
    gutil.log("Error adding sticker");
    gutil.log(e);
  });
})