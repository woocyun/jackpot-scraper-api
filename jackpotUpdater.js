const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const cheerio = require('cheerio');

const url = 'http://www.lotteryusa.com/lottery/jackpot/jackpot_fcur.html';
const dataLocation = path.resolve(__dirname, 'data', 'lotteries.json');

function updateJackpots() {
  fs.readFile(dataLocation, (err, data) => {
    if (!err) {
      onReadFileSuccess(data);
    }
  });
}

function onReadFileSuccess(data) {
  const parsed = JSON.parse(data);

  rp(url)
    .then(onRequestSuccess)
    .catch(error => {});

  function onRequestSuccess(htmlString) {
    const $ = cheerio.load(htmlString);
    const games = $('.game');

    const matchedGames = games
      .map(function () {
        return {
          name: $(this).children().text(),
          jackpot: $(this).siblings('.jackpot').children('.next-jackpot').text()
        };
      })
      .get();

    updateLotteries(matchedGames, parsed);
  }
}

function updateLotteries(games, parsed) {
  const updatedLotteries = parsed.lotteries
    .map(lottery => {
      const game = games.find(game => game.name === lottery.name);

      if (game) {
        console.log(`setting ${ game.name }'s jackpot to ${ game.jackpot }'`);
        return Object.assign({}, lottery, game);
      } else {
        return lottery;
      }
    });

  fs.writeFile(dataLocation, JSON.stringify(Object.assign({}, parsed, { lotteries: updatedLotteries }), null, 4), (err) => {
    if (!err) {
      console.log('success!');
    }
  });
}

module.exports = function () {
  updateJackpots();
};
