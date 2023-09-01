// require express and it's router component
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const axios = require('axios');

const cheerio = require('cheerio');
const fns = require('date-fns');
const db = require('../../db');
const { Btts } = require('../../mongo_schema/Btts');
const { Over } = require('../../mongo_schema/Over');
const { getHomeTeamName } = require('../../utils');

const today = new Date();
const yesterday = new Date(today);
const tomorrow = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);
tomorrow.setDate(tomorrow.getDate() + 1);
const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
const formattedToday = fns.format(today, 'dd.MM.yyyy');
const yesterdayString = formattedYesterday.toString();
const todayString = formattedToday.toString();
const year = today.getFullYear();
const day = today.getDate();
const dayTom = tomorrow.getDate();
let month = today.getMonth();
month = month < 10 ? `0${month + 1}` : month + 1;

const ORIGIN = process.env.ORIGIN;

const bttsRouter = express.Router();

bttsRouter.use(cors());
const corsOptions = {
  origin: ORIGIN,
};

// const url_fbp =
//   'https://footballpredictions.net/btts-tips-both-teams-to-score-predictions';
// const url_accum = 'https://footyaccumulators.com/football-tips/btts';
const url_fst = 'https://www.freesupertips.com/both-teams-to-score-tips/';
// const url_banker = 'https://bankerpredict.com/both-team-to-score';
const url_r2bet = 'https://r2bet.com/gg_btts';
// const url_prot = 'https://www.protipster.com/betting-tips/btts';
const url_footsuper_btts =
  'https://www.footballsuper.tips/football-accumulators-tips/football-tips-both-teams-to-score-accumulator/';

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const btts = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo

bttsRouter.get('/get', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const bttsArr = await Btts.find({ date: req.query.date });
  const overArr = await Over.find({ date: req.query.date });
  await db.disconnect();

  let allData = [];
  allData = allData.concat(bttsArr).concat(overArr);

  res.json(allData);
});
bttsRouter.get('/delete', cors(corsOptions), async (req, res) => {
  // const today = new Date();
  // const formattedToday = fns.format(today, 'dd.MM.yyyy');
  // const todayString = formattedToday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await Btts.deleteMany({ date: todayString });
  console.log('btts deleted'); // Success
  res.send('btts deleted');
  await db.disconnect();
});

bttsRouter.post('/save', async (req, res) => {
    // console.log('dataPred000');
  let data = req.body;
  
//   console.log('dataPred', data);
  if (data.homeTeam.length !== 0) {
    data.homeTeam.forEach(async (elem) => {
      const newBttsObj = {
        source: data.source,
        action: data.action,
        homeTeam: getHomeTeamName(elem) !== '' ? getHomeTeamName(elem) : elem,
        predTeam:
          getHomeTeamName(data.predTeam) !== ''
            ? getHomeTeamName(data.predTeam)
            : data.predTeam,
        date: data.date,
        isAcca: data.isAcca,
      };

      mongoose.connect(
        'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          // useCreateIndex: true,
          useUnifiedTopology: true,
        }
      );
      let newBtts = await new Btts(newBttsObj);
      await newBtts.save(function (err) {
        if (err) return console.error(err);
        console.log('new pred saved succussfully!');
      });

      await db.disconnect();
    });
    console.log('new Over saved succussfully!');
  }

  res.json('new preds inserted');
});

bttsRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('btts111');
  // FBP
  //   await axios(url_fbp)
  //     .then((response) => {
  //       const html = response.data;
  //       // console.log(response.data);
  //       // console.log('000', response);
  //       const $ = cheerio.load(html);

  //       $('.accumulator-row', html).each(function () {
  //         //<-- cannot be a function expression
  //         // const title = $(this).text();
  //         const teams = $(this).find('.accumulator-name').text();

  //         // const prediction = $(this)
  //         //   .find('.accumulator-name')
  //         //   .find('strong')
  //         //   .text();

  //         const homeTeam = teams.includes('vs') && teams.split('vs')[0];
  //         const awayTeam = teams.includes('vs') && teams.split('vs')[1];

  //         homeTeam !== '' &&
  //           btts.push({
  //             source: 'fbp',
  //             action: 'btts',
  //             isAcca: true,
  //             homeTeam: homeTeam.trim(),
  //             awayTeam,
  //             date: todayString,
  //             // predictionDate: predictionDate,
  //           });
  //       });

  //     //   res.send('fbp btts ok');
  //     })
  //     .catch((err) => console.log(err));

  //PROT
  //   await axios(url_prot)
  //     .then((response) => {
  //       const html = response.data;

  //       // console.log('000', html);
  //       const $ = cheerio.load(html);

  //       $('.details-pick', html).each(function () {
  //         //<-- cannot be a function expression
  //         // const title = $(this).text();
  //         const teams = $(this).find('.details-pick__match-data__teams').text();
  //         const homeTeam = teams.split(' VS ')[0];
  //         const awayTeam = teams.split(' VS ')[1];

  //         homeTeam !== '' &&
  //           btts.push({
  //             source: 'prot',
  //             action: 'btts',
  //             isAcca: false,
  //             homeTeam: homeTeam.trim(),
  //             awayTeam: awayTeam.trim(),
  //             date: todayString,
  //           });
  //       });

  //     //   res.send('prot btts ok');
  //     })
  //     .catch((err) => console.log(err));

  //FOOTSUPER_BTTS
  await axios(url_footsuper_btts)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.classfull', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.gamelink').text().split(' v ')[0];
        const awayTeam = $(this).find('.gamelink').text().split(' v ')[1];

        homeTeam !== '' &&
          btts.push({
            source: 'footsuper_btts',
            action: 'btts',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      //   res.send('footsuper btts ok');
    })
    .catch((err) => console.log(err));

  //BANKER
  //   await axios(url_banker)
  //     .then((response) => {
  //       const html = response.data;

  //       // console.log('000', html);
  //       const $ = cheerio.load(html);

  //       const body = $('section:nth-child(2) tbody', html);

  //       $('tr', body).each(function () {
  //         //<-- cannot be a function expression
  //         // const title = $(this).text();
  //         const homeTeam = $(this)
  //           .find('td:nth-child(3)')
  //           .find('span:first')
  //           .text()
  //           .split('VS')[0];

  //         const awayTeam = $(this)
  //           .find('td:nth-child(3)')
  //           .find('span:first')
  //           .text()
  //           .split('VS')[1];

  //         homeTeam !== '' &&
  //           btts.push({
  //             source: 'banker',
  //             action: 'btts',
  //             checked: false,
  //             homeTeam: homeTeam.trim(),
  //             awayTeam: awayTeam.trim(),
  //             date: todayString,
  //           });
  //       });

  //     //   res.send('banker btts ok');
  //     })
  //     .catch((err) => console.log(err));

  //r2bet
  await axios(url_r2bet)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('tr', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('td:nth-child(3)').text().split('VS')[0];

        const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];
        // const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          btts.push({
            source: 'r2bet',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      //   res.send('r2bet btts ok');
    })
    .catch((err) => console.log(err));

  //ACCUM
  //   await axios(url_accum)
  //     .then((response) => {
  //       const html = response.data;
  //       // console.log('000', html);
  //       const $ = cheerio.load(html);
  //       const accumArr = [];

  //       $('.zWPB', html).each(function () {
  //         const accumElem = $(this).find('div:first').text();
  //         const accumDate = $(this).find('.date').text();
  //         // console.log('accumDate', accumDate);
  //         accumArr.push({ team: accumElem, predictionDate: accumDate });
  //       });

  //       for (let i = 0; i < accumArr.length - 1; i++) {
  //         let accumObj = {
  //           source: 'accum',
  //           action: 'btts',
  //           checked: false,
  //           homeTeam: '',
  //           date: todayString,
  //           predictionDate: '',
  //         };

  //         if (i === 0 || i % 2 === 0) {
  //           accumObj.homeTeam = accumArr[i].team.trim();
  //           accumObj.predictionDate = accumArr[i + 1].predictionDate;
  //         }
  //         // console.log('accumArr[i]', accumArr[i]);
  //         // console.log('accumObj', accumObj);
  //         accumObj.homeTeam !== '' && btts.push(accumObj);
  //       }

  //       res.send('accum btts ok');
  //     })
  //     .catch((err) => console.log(err));

  //FST
  await axios(url_fst)
    .then((response) => {
      const html = response.data;
      // const over25 = [];
      const $ = cheerio.load(html);

      $('.Leg__title', html).each(function () {
        let homeTeam = '';
        let awayTeam = '';

        homeTeam = $(this).find('.Leg__lose').text().split('vs')[0];
        awayTeam = $(this).find('.Leg__lose').text().split('vs')[1];

        homeTeam !== '' &&
          btts.push({
            source: 'fst',
            action: 'btts',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
      });

      //   res.send('fst btts ok');
    })
    .catch((err) => console.log(err));

  let start = 0;
  let next = 1;
  let sortedBtts = btts.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next < sortedBtts.length) {
    if (
      sortedBtts[start].homeTeam.trim() === sortedBtts[next].homeTeam.trim()
    ) {
      if (
        sortedBtts[start].action === sortedBtts[next].action &&
        sortedBtts[start].source === sortedBtts[next].source
      ) {
        sortedBtts.splice(next, 1);
      }
    }

    start++;
    next++;
  }

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await Btts.insertMany(sortedBtts)
    .then(function () {
      console.log('Btts inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('btts loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = bttsRouter;
