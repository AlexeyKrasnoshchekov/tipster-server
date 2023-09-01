// require express and it's router component
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const { ProxyCrawlAPI } = require('proxycrawl');
const api1 = new ProxyCrawlAPI({ token: 'IpErJSu5VcdhkKqgLRJiwQ' });
const cheerio = require('cheerio');
const fns = require('date-fns');
const db = require('../../db');
const { Btts } = require('../../mongo_schema/Btts');
const { Over } = require('../../mongo_schema/Over');
const { WinData } = require('../../mongo_schema/winDataModel');
const { getHomeTeamName } = require('../../utils');

const ORIGIN = process.env.ORIGIN;

const crawlRouter = express.Router();

crawlRouter.use(cors());
const corsOptions = {
  origin: ORIGIN,
};

const today = new Date();
const formattedToday = fns.format(today, 'dd.MM.yyyy');
const todayString = formattedToday.toString();

const day = today.getDate();

const url_bettingtips =
  'https://www.bettingtips.today/football-accumulators-tips/';
const url_wincomparator = 'https://www.wincomparator.com/predictions/';

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const crawlData = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
crawlRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('crawl111');
  //Bettingtips
  await api1
    .get(url_bettingtips)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        // console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        $('.diveachgame', html).each(function () {
          const pred = $(this).find('.icontip').find('span:first').text();

          const homeTeam = $(this)
            .find('.dividehome')
            .find('div:first')
            .find('.teamtip')
            .text();
          const awayTeam = $(this)
            .find('.divideaway')
            .find('div:first')
            .find('.teamtip')
            .text();

          if (homeTeam !== '' && pred.includes('Over')) {
            crawlData.push({
              source: 'bettingtips',
              action: 'over25',
              isAcca: true,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
          } else if (homeTeam !== '' && pred.includes('Yes')) {
            crawlData.push({
              source: 'bettingtips',
              action: 'btts',
              isAcca: true,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
          } else if (
            homeTeam !== '' &&
            (pred.includes('1') || pred.includes('2'))
          ) {
            crawlData.push({
              source: 'bettingtips',
              action: 'win',
              isAcca: true,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString,
              prediction: pred.includes('1') ? homeTeam : awayTeam,
            });
          }
        });
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }

      // res.send('bettingtips crawl loaded');
    })
    .catch((err) => console.log(err));

  //Wincomparator
  await api1
    .get(url_wincomparator)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        // console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        $('.card', html).each(function () {
          const pred = $(this)
            .find('.tips__event__tip__prono ')
            .find('span:nth-child(2)')
            .text();
          let date = $(this).find('.tips__event__tip__date').text();
          date = date.split('/')[0];

          const homeTeam = $(this)
            .find('a:first')
            .find('.break-words:first')
            .text();
          const awayTeam = $(this)
            .find('a:first')
            .find('.break-words:nth-child(2)')
            .text();

          if (date.includes(`${day}`)) {
            if (homeTeam !== '' && pred.includes('Over')) {
              crawlData.push({
                source: 'wincomparator',
                action: 'over25',
                isAcca: true,
                homeTeam:
                  getHomeTeamName(homeTeam.trim()) !== ''
                    ? getHomeTeamName(homeTeam.trim())
                    : homeTeam.trim(),
                awayTeam,
                date: todayString,
              });
            } else if (
              homeTeam !== '' &&
              pred.includes('Both teams to score')
            ) {
              crawlData.push({
                source: 'wincomparator',
                action: 'btts',
                isAcca: true,
                homeTeam:
                  getHomeTeamName(homeTeam.trim()) !== ''
                    ? getHomeTeamName(homeTeam.trim())
                    : homeTeam.trim(),
                awayTeam,
                date: todayString,
              });
            } else if (homeTeam !== '' && pred.includes('Match Winner')) {
              crawlData.push({
                source: 'wincomparator',
                action: 'win',
                isAcca: true,
                homeTeam:
                  getHomeTeamName(homeTeam.trim()) !== ''
                    ? getHomeTeamName(homeTeam.trim())
                    : homeTeam.trim(),
                awayTeam,
                date: todayString,
                prediction: pred.includes(homeTeam) ? homeTeam : awayTeam,
              });
            }
          }
        });
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }

      // res.send('wincomparator crawl loaded');
    })
    .catch((err) => console.log(err));

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const bttsDataCrawl = crawlData.filter((item) => item.action === 'btts');

  await Btts.insertMany(bttsDataCrawl)
    .then(function () {
      console.log('crawl Btts inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  const overDataCrawl = crawlData.filter((item) => item.action === 'over25');

  await Over.insertMany(overDataCrawl)
    .then(function () {
      console.log('crawl Over inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  const winDataCrawl = crawlData.filter((item) => item.action === 'win');
  await WinData.insertMany(winDataCrawl)
    .then(function () {
      console.log('winDataCrawl inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('crawl loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = crawlRouter;
