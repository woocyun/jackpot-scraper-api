const express = require('express');
const fs = require('fs');

const app = express();

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.get('/lotteries', (req, res) => {
  fs.readFile('data/lotteries.json', 'utf-8', (err, data) => {
    if (!err) {
      res.json(JSON.parse(data));
    } else {
      res.status(500).send('aw crap');
    }
  });
});

app.listen(port);

require('./jackpotScraper')();
