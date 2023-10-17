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
const { WinData } = require('../../mongo_schema/WinDataModel');
const { getHomeTeamName } = require('../../utils');
const { Under25 } = require('../../mongo_schema/Under25');
const { Draw } = require('../../mongo_schema/Draw');

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

const url_bettingtips_acc =
  'https://www.bettingtips.today/football-accumulators-tips/';
const url_bettingtips_over =
  'https://www.bettingtips.today/over-under-predictions-tips/';
const url_bettingtips_win =
  'https://www.bettingtips.today/1x2-betting-tips/';
const url_bettingtips_btts =
  'https://www.bettingtips.today/both-teams-to-score-predictions-tips/';
const url_wincomparator = 'https://www.wincomparator.com/predictions/';
const url_betclan = 'https://www.betclan.com/accumulator-tips-for-today/';
const url_betshoot_o25 =
  'https://www.betshoot.com/football/over-25-goals-tips/';
const url_betshoot_btts =
  'https://www.betshoot.com/football/both-teams-to-score-tips/';

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const crawlData = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
crawlRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('crawl111');
  //Bettingtips_acc
  await api1
    .get(url_bettingtips_acc)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        // console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        $('section', html).each(function () {
          const type = $(this).find('.leagueslinks').text();

          // console.log('000', type);

          if (type === 'Bankers') {
            $('.diveachgame', this).each(function () {
              const pred = $(this).find('.icontip').find('span:first').text();
              // console.log('000', pred);
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

              if (
                homeTeam !== '' &&
                (pred.includes('1') || pred.includes('2'))
              ) {
                crawlData.push({
                  source: 'bettingtips_acc_win',
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
            $('.diveachgame', this).each(function () {
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
                  source: 'bettingtips_acc_o25',
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
                  source: 'bettingtips_acc_btts',
                  action: 'btts',
                  isAcca: true,
                  homeTeam:
                    getHomeTeamName(homeTeam.trim()) !== ''
                      ? getHomeTeamName(homeTeam.trim())
                      : homeTeam.trim(),
                  awayTeam,
                  date: todayString,
                });
              }
            });
          }
        });
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }

      // res.send('bettingtips crawl loaded');
    })
    .catch((err) => console.log(err));

  //Bettingtips_over
  await api1
    .get(url_bettingtips_over)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        // console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        $('.fullgame', html).each(function () {

          const pred = $(this).find('.icontip').find('span:first').text();
          // console.log('000', pred);
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

          if (homeTeam !== '' && (pred.includes('Over'))) {
            crawlData.push({
              source: 'bettingtips_o25',
              action: 'over25',
              isAcca: false,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString
            });
          }
          if (homeTeam !== '' && (pred.includes('Under'))) {
            crawlData.push({
              source: 'bettingtips_u25',
              action: 'under25',
              isAcca: false,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString
            });
          }

          // console.log('000', type);
        });
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }

      // res.send('bettingtips crawl loaded');
    })
    .catch((err) => console.log(err));
  //Bettingtips_win
  await api1
    .get(url_bettingtips_win)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        // console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        $('.fullgame', html).each(function () {

          const pred = $(this).find('.icontip').find('span:first').text();
          // console.log('000', pred);
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

            if (
              homeTeam !== '' &&
              (pred.includes('1') || pred.includes('2'))
            ) {
              crawlData.push({
                source: 'bettingtips_win',
                action: 'win',
                isAcca: false,
                homeTeam:
                  getHomeTeamName(homeTeam.trim()) !== ''
                    ? getHomeTeamName(homeTeam.trim())
                    : homeTeam.trim(),
                awayTeam,
                date: todayString,
                prediction: pred.includes('1') ? homeTeam : awayTeam,
              });
            }

            if (
              homeTeam !== '' &&
              (pred.includes('X'))
            ) {
              crawlData.push({
                source: 'bettingtips_draw',
                action: 'draws',
                isAcca: false,
                homeTeam:
                  getHomeTeamName(homeTeam.trim()) !== ''
                    ? getHomeTeamName(homeTeam.trim())
                    : homeTeam.trim(),
                awayTeam,
                date: todayString,
              });
            }

          // console.log('000', type);
        });
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }

      // res.send('bettingtips crawl loaded');
    })
    .catch((err) => console.log(err));
  //Bettingtips_btts
  await api1
    .get(url_bettingtips_btts)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        // console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        $('.fullgame', html).each(function () {

          const pred = $(this).find('.icontip').find('span:first').text();
          // console.log('000', pred);
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

            if (homeTeam !== '' && (pred.includes('Yes'))) {
              crawlData.push({
                source: 'bettingtips_btts',
                action: 'btts',
                isAcca: false,
                homeTeam:
                  getHomeTeamName(homeTeam.trim()) !== ''
                    ? getHomeTeamName(homeTeam.trim())
                    : homeTeam.trim(),
                awayTeam,
                date: todayString
              });
            }
            if (homeTeam !== '' && (pred.includes('No'))) {
              crawlData.push({
                source: 'bettingtips_btts',
                action: 'btts no',
                isAcca: false,
                homeTeam:
                  getHomeTeamName(homeTeam.trim()) !== ''
                    ? getHomeTeamName(homeTeam.trim())
                    : homeTeam.trim(),
                awayTeam,
                date: todayString
              });
            }

          // console.log('000', type);
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
                source: 'wincomparator_o25',
                action: 'over25',
                isAcca: true,
                homeTeam:
                  getHomeTeamName(homeTeam.trim()) !== ''
                    ? getHomeTeamName(homeTeam.trim())
                    : homeTeam.trim(),
                awayTeam,
                date: todayString,
              });
            } else if (homeTeam !== '' && pred.includes('Under 2.5')) {
              crawlData.push({
                source: 'wincomparator_u25',
                action: 'under25',
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
                source: 'wincomparator_btts',
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
              (pred.includes('Match Winner') || pred.includes('Win'))
            ) {
              crawlData.push({
                source: 'wincomparator_win',
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
  //betclan
  await api1
    .get(url_betclan)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        // console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        $('.bclisttip', html).each(function () {
          const pred = $(this)
            .find('.bctip')
            .find('span:nth-child(1)')
            .find('span:nth-child(1)')
            .text();

          const homeTeam = $(this).find('.bchome').text();
          const awayTeam = $(this).find('.bcaway').text();

          if (homeTeam !== '' && pred.includes('Over')) {
            crawlData.push({
              source: 'betclan_o25',
              action: 'over25',
              isAcca: true,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
          } else if (homeTeam !== '' && pred.includes('Under')) {
            crawlData.push({
              source: 'betclan_u25',
              action: 'under25',
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
            (pred.includes('Yes') || pred.includes('No'))
          ) {
            crawlData.push({
              source: 'betclan_btts',
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
            (pred.includes(`${homeTeam}`) || pred.includes(`${awayTeam}`))
          ) {
            crawlData.push({
              source: 'betclan_win',
              action: 'win',
              isAcca: true,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString,
              prediction: pred.includes(`${homeTeam}`) ? homeTeam : awayTeam,
            });
          }
        });
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }

      // res.send('wincomparator crawl loaded');
    })
    .catch((err) => console.log(err));
  //betshoot_o25
  await api1
    .get(url_betshoot_o25)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        //  console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        const body = $('section:nth-child(1)', html);

        $('.mth', body).each(function () {
          const homeTeam = $(this)
            .find('.teams')
            .find('a')
            .text()
            .split(' vs ')[0];

          const awayTeam = $(this)
            .find('.teams')
            .find('a')
            .text()
            .split(' vs ')[1];

          if (homeTeam !== '') {
            crawlData.push({
              source: 'betshoot_o25',
              action: 'over25',
              isAcca: true,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
          }
        });
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }

      // res.send('wincomparator crawl loaded');
    })
    .catch((err) => console.log(err));
  //betshoot_btts
  await api1
    .get(url_betshoot_btts)
    .then((response) => {
      if (response.statusCode === 200 && response.originalStatus === 200) {
        // console.log('000', response.body);
        const html = response.body;
        const $ = cheerio.load(html);

        const body = $('section:nth-child(1)', html);

        $('.mth', body).each(function () {
          const homeTeam = $(this)
            .find('.teams')
            .find('a')
            .text()
            .split(' vs ')[0];
          const awayTeam = $(this)
            .find('.teams')
            .find('a')
            .text()
            .split(' vs ')[1];

          if (homeTeam !== '') {
            crawlData.push({
              source: 'betshoot_btts',
              action: 'btts',
              isAcca: true,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
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

  const bttsDataCrawl = crawlData.filter((item) => item.action.includes('btts'));
  console.log('bttsDataCrawl', bttsDataCrawl);
  await Btts.insertMany(bttsDataCrawl)
    .then(function () {
      console.log('crawl Btts inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  const drawsDataCrawl = crawlData.filter((item) => item.action === 'draws');
  console.log('drawsDataCrawl', drawsDataCrawl);
  await Draw.insertMany(drawsDataCrawl)
    .then(function () {
      console.log('Draws inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  const overDataCrawl = crawlData.filter((item) => item.action === 'over25');
  console.log('overDataCrawl', overDataCrawl);
  await Over.insertMany(overDataCrawl)
    .then(function () {
      console.log('crawl Over inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  const underDataCrawl = crawlData.filter((item) => item.action === 'under25');
  console.log('underDataCrawl', underDataCrawl);
  await Under25.insertMany(underDataCrawl)
    .then(function () {
      console.log('crawl Under inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  const winDataCrawl = crawlData.filter((item) => item.action === 'win');
  console.log('winDataCrawl', winDataCrawl);
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
