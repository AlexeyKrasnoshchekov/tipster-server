const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const fns = require('date-fns');

const db = require('./db');
const utils = require('./utils');
// const Btts = require("./mongo_schema/Btts");
const mongoose = require('mongoose');
const { Btts } = require('./mongo_schema/Btts');
const { Result } = require('./mongo_schema/Result');
const { ResultTotal } = require('./mongo_schema/ResultTotal');
const { Stat } = require('./mongo_schema/Stat');
const { TodayBet } = require('./mongo_schema/TodayBet');
mongoose.set('strictQuery', true);

/////////// Mongo Model Schema
// const { Schema } = mongoose;

// const bttsSchema = new Schema(
//   {
//     source: { type: String, required: true },
//     action: { type: String, required: true },
//     homeTeam: { type: String, required: true },
//     awayTeam: { type: String, required: false },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Btts = mongoose.models?.Btts || mongoose.model('Btts', bttsSchema);

// Btts model
// const Btts = mongoose.model(
//   'Btts',
//   new mongoose.Schema(
//     {
//       source: { type: String, required: true },
//       action: { type: String, required: true },
//       homeTeam: { type: String, required: true },
//       awayTeam: { type: String, required: false },
//     },
//     {
//       timestamps: true,
//     }
//   )
// );

///////////////////////////////

////Get Data
const btts = [];
const results = [];

const scrapeData = async function (req, res) {
  const url_fbp =
    'https://footballpredictions.net/btts-tips-both-teams-to-score-predictions';
  const url_accum = 'https://footyaccumulators.com/football-tips/btts';
  const url_fst = 'https://www.freesupertips.com/free-football-betting-tips/';
  const url_footy = 'https://footystats.org/predictions/btts';
  const url_betshot =
    'https://www.betshoot.com/football/both-teams-to-score-tips/';
  const url_mighty = 'https://www.mightytips.com/football-predictions/btts/';
  // const url_passion = 'https://passionpredict.com/both-team-to-score';
  // const url_onemill = 'https://onemillionpredictions.com/saturday-football-predictions/both-teams-to-score/';
  const url_mybets =
    'https://www.mybets.today/soccer-predictions/both-teams-to-score-predictions/';
  // const url_result = 'https://footystats.org/yesterday/';
  const url_result2 = 'https://www.livescore.bz/en/yesterday/';
  const url_fbpai =
    'https://footballpredictions.ai/football-predictions/btts-predictions/';

  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();
  const todayString = formattedToday.toString();
  const year = today.getFullYear();
  const day = today.getDate();
  let month = today.getMonth();
  month = month < 10 ? `0${month + 1}` : month + 1;

  //FBP
  await axios(url_fbp)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.match-preview', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.home-team').find('.team-label').text();
        const awayTeam = $(this).find('.away-team').find('.team-label').text();
        const predictionDate = $(this)
          .find('.match-preview-date')
          .find('.full-cloak')
          .text();
        btts.push({
          source: 'fbp',
          action: 'btts',
          checked: false,
          homeTeam: homeTeam.trim(),
          awayTeam,
          date: todayString,
          predictionDate: predictionDate,
        });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // MIGHTY
  await axios(url_mighty)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.mtl-index-page-matches__item', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('.mtl-index-page-matches__name')
          .text()
          .split(' vs ')[0];
        const awayTeam = $(this)
          .find('.mtl-index-page-matches__name')
          .text()
          .split(' vs ')[1];
        const predicDate = $(this)
          .find('.mtl-index-page-matches__date')
          .find('p:first')
          .find('time:first')
          .text();

        todayString.includes(predicDate) &&
          btts.push({
            source: 'mighty',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //PASSION
  await axios(
    `https://passionpredict.com/both-team-to-score?dt=${year}-${month}-${day}`
  )
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);
      let homeTeamsArr = [];

      $('tr', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:first')
          .text()
          .split(' VS')[0];
        // const awayTeam = $(this).find('tr').find('td:nth-child(3)').find('span:first').text().split(' "" ')[1].split(' VS')[1];
        // const awayTeam = $(this).find('.mtl-index-page-matches__name').text().split(' vs ')[1];
        // const predicDate = $(this).find('.mtl-index-page-matches__date').find('p:first').find('time:first').text();
        // console.log('homeTeamPass', homeTeam);
        homeTeamsArr.push(homeTeam);
      });
      // console.log('homeTeamsArr', homeTeamsArr);
      homeTeamsArr.splice(0, 1);
      // console.log('homeTeamsArr111', homeTeamsArr);
      let indexOfEmpty = homeTeamsArr.indexOf('');
      // console.log('indexOfEmpty', indexOfEmpty);
      let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
      // console.log('todayHomeTeamsArr', todayHomeTeamsArr);
      todayHomeTeamsArr.forEach((elem) => {
          btts.push({
            source: 'passion',
            action: 'btts',
            checked: false,
            homeTeam: elem,
            awayTeam: '',
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  // MYBETS
  await axios(url_mybets)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.linkgames', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        // const homeTeam = $(this).find('.homeTeam').find('span:first').text();
        const homeTeam = $(this).find('.homespan').text();
        const awayTeam = $(this).find('.awayspan').text();
        const bttsYes = $(this).find('.tipdiv').find('span:first').text();
        bttsYes === 'Yes' &&
          btts.push({
            source: 'mybets',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //Footy
  await axios(url_footy)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.betHeader', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('.betHeaderTitle')
          .text()
          .split(' vs ')[0];
        let homeTeam1 = '';
        if (homeTeam.includes('Yes')) {
          homeTeam1 = homeTeam.split('BTTS Yes ')[1];
        }
        const awayTeam = $(this)
          .find('.betHeaderTitle')
          .text()
          .split(' vs ')[1];
        homeTeam1 !== '' &&
          btts.push({
            source: 'footy',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam1.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //Fbpai
  await axios(url_fbpai)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.footgame', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();

        const isBttsFbpai = $(this).find('.match-tip-show').text();

        if (isBttsFbpai === 'Yes') {
          const homeTeam = $(this)
            .find('a:first')
            .attr('title')
            .split(' - ')[0];
          const awayTeam = $(this)
            .find('a:first')
            .attr('title')
            .split(' - ')[1];
          btts.push({
            source: 'fbpai',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
        }
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //result

  // await axios(url_result)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.match-info', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       const homeTeam = $(this).find('.home').find('span:first').text();
  //       const awayTeam = $(this).find('.away').find('span:first').text();
  //       const score = $(this).find('.ft-score').text();

  //       if (
  //         score !== '' &&
  //         awayTeam !== '' &&
  //         homeTeam !== '' &&
  //         yesterdayString !== ''
  //       ) {
  //         results.push({
  //           score,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam,
  //           date: yesterdayString,
  //         });
  //       }
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));
  //result2
  await axios(url_result2)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.m', html).each(function () {
        // $([class="w-6/12 md:w-7/12 clickandstop"], html).each(function () {
        //   <-- cannot be a function expression
        //   const title = $(this).text();

        // console.log('000', $(this));

        const homeTeam = $(this).find('t1:first').find('t:first').text();
        const awayTeam = $(this).find('t2:first').find('t:first').text();

        const score = $(this).find('sc:first').text();

        // const obj111 = {
        //   score,
        //   homeTeam: homeTeam.trim(),
        //   awayTeam,
        //   date: yesterdayString,
        // };

        // console.log('obj111', obj111);

        if (
          score !== '' &&
          awayTeam !== '' &&
          homeTeam !== '' &&
          yesterdayString !== ''
        ) {
          results.push({
            score,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: yesterdayString,
          });
        }
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //ACCUM
  await axios(url_accum)
    .then((response) => {
      const html = response.data;
      // console.log('000', html);
      const $ = cheerio.load(html);
      const accumArr = [];

      $('.zWPB', html).each(function () {
        const accumElem = $(this).find('div:first').text();
        const accumDate = $(this).find('.date').text();
        // console.log('accumDate', accumDate);
        accumArr.push({ team: accumElem, predictionDate: accumDate });
      });
      // console.log('accumArr', accumArr);
      for (let i = 0; i < accumArr.length - 1; i++) {
        let accumObj = {
          source: 'accum',
          action: 'btts',
          checked: false,
          homeTeam: '',
          date: todayString,
          predictionDate: '',
        };

        if (i === 0 || i % 2 === 0) {
          accumObj.homeTeam = accumArr[i].team.trim();
          accumObj.predictionDate = accumArr[i + 1].predictionDate;
        }
        // console.log('accumArr[i]', accumArr[i]);
        // console.log('accumObj', accumObj);
        accumObj.homeTeam !== '' && btts.push(accumObj);
      }

      // return res.send({ message: 'seeded successfully' });
      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //FST
  await axios(url_fst)
    .then((response) => {
      const html = response.data;
      // const btts = [];
      const $ = cheerio.load(html);

      $('.Leg__title', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const isBttsFst = $(this).find('.Leg__win').text();
        let homeTeam = '';
        let awayTeam = '';
        if (isBttsFst === 'Both Teams To Score') {
          homeTeam = $(this).find('.Leg__lose').text().split('vs')[0];
          awayTeam = $(this).find('.Leg__lose').text().split('vs')[1];
          btts.push({
            source: 'fst',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
        }
      });

      // res.json(btts);
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
  while (next < sortedBtts.length) {
    if (
      sortedBtts[start].homeTeam.trim() === sortedBtts[next].homeTeam.trim()
    ) {
      if (sortedBtts[start].source === sortedBtts[next].source) {
        sortedBtts.splice(next, 1);
      }
    }

    start++;
    next++;
  }

  // console.log('btts', btts);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  // Function call

  await Btts.insertMany(sortedBtts)
    .then(function () {
      console.log('Btts inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  // await Result.deleteMany();
  // console.log('results111', results);

  // await Result.insertMany(results)
  //   .then(function () {
  //     console.log('Results inserted'); // Success
  //   })
  //   .catch(function (error) {
  //     console.log(error); // Failure
  //   });

  await db.disconnect();
};

const deleteRawResults = async function (req, res) {
  const yesterday1 = new Date(new Date().setDate(new Date().getDate() - 2));

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  console.log('yesterday1', yesterday1);

  await Result.deleteMany({ Timestamp: { $gt: yesterday1 } });

  await db.disconnect();
};
const deleteBttsByDate = async function (req, res) {
  const today = new Date();
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const todayString = formattedToday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  console.log('todayString', todayString);

  await Btts.deleteMany({ date: todayString });

  await db.disconnect();
};

const saveResults = async function (req, res) {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();

  const bttsArr = await Btts.find({ date: yesterdayString });
  const resultsArr = await Result.find({ date: yesterdayString });
  // await Btts.deleteMany();
  // console.log('resultsArr', resultsArr);
  // await db.disconnect();

  let resultsTotal = [];

  for (let i = 0; i < resultsArr.length; i++) {
    for (let j = 0; j < bttsArr.length; j++) {
      // console.log('111111', bttsArr[j].homeTeam);
      // console.log('222222', utils.getHomeTeamName(bttsArr[j].homeTeam));

      if (
        resultsArr[i].homeTeam === bttsArr[j].homeTeam ||
        bttsArr[j].homeTeam.includes(resultsArr[i].homeTeam) ||
        resultsArr[i].homeTeam.includes(bttsArr[j].homeTeam) ||
        resultsArr[i].homeTeam === utils.getHomeTeamName(bttsArr[j].homeTeam)
      ) {
        let totalElemObj = {
          homeTeam: '',
          awayTeam: '',
          score: '',
          source: '',
          prediction: '',
          date: yesterdayString,
          bttsRes: false,
          over05Res: false,
          over15Res: false,
          over25Res: false,
        };

        totalElemObj.homeTeam = resultsArr[i].homeTeam;
        totalElemObj.awayTeam = bttsArr[j].awayTeam;
        totalElemObj.score = resultsArr[i].score;
        totalElemObj.source = bttsArr[j].source;
        totalElemObj.prediction = bttsArr[j].action;
        totalElemObj.bttsRes =
          parseInt(resultsArr[i].score.split(' - ')[0]) > 0 &&
          parseInt(resultsArr[i].score.split(' - ')[1]) > 0;
        totalElemObj.over05Res =
          parseInt(resultsArr[i].score.split(' - ')[0]) +
            parseInt(resultsArr[i].score.split(' - ')[1]) >
          0;
        totalElemObj.over15Res =
          parseInt(resultsArr[i].score.split(' - ')[0]) +
            parseInt(resultsArr[i].score.split(' - ')[1]) >
          1;
        totalElemObj.over25Res =
          parseInt(resultsArr[i].score.split(' - ')[0]) +
            parseInt(resultsArr[i].score.split(' - ')[1]) >
          2;

        resultsTotal.push(totalElemObj);
        // console.log('totalElemObj', totalElemObj);
      }
    }
  }

  // console.log('resultsTotal', resultsTotal);
  // await ResultTotal.deleteMany();
  await ResultTotal.insertMany(resultsTotal)
    .then(function () {
      console.log('ResultsTotal inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  await db.disconnect();
};

// const saveDataMongo = async function (req, res, next) {
//   console.log('saveDataMongo', btts);
//   // Database connection

//   res.json('inserted');
//   next();
// };

// app.use(scrapeData);

const jobScrape = schedule.scheduleJob({ hour: 15, minute: 02 }, scrapeData);
// const jobSave = schedule.scheduleJob({ hour: 10, minute: 09 }, saveResults);
// const jobSave = schedule.scheduleJob({ hour: 15, minute: 00 }, deleteBttsByDate);

// const job = schedule.scheduleJob('07 * * * *', scrapeData);

// const job = schedule.scheduleJob('52 * * * *', saveResults);
// app.use(saveDataMongo);

app.use(bodyParser.json());

app.use(cors());

///////APIS

app.get('/', function (req, res) {
  res.json('This is my webscraper');
});

// app.get('/getBtts', (req, res) => {
//   // db.connect();
//   // const bttsArr = Btts.find({});
//   // db.disconnect();

//   res.json(btts);
// });
app.get('/getBttsMongo', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const bttsArr = await Btts.find({ date: req.query.date });
  // await Btts.deleteMany();
  // console.log('bttsArr', bttsArr);
  await db.disconnect();

  res.json(bttsArr);
});
app.get('/getResultsTotalMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const resultsArr = await ResultTotal.find({ date: req.query.date });
  // const resultsArr = await Result.find({});
  // await Btts.deleteMany();
  // console.log('resultsArr', resultsArr);
  await db.disconnect();

  res.json(resultsArr);
});
app.get('/deleteResultsTotalMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await ResultTotal.deleteOne({ homeTeam: req.query.homeTeam });

  // const resultTotal = await ResultTotal.find({ homeTeam: req.query.homeTeam });
  // if (resultTotal) {
  //   await resultTotal.remove();
  //   await db.disconnect();
  //   res.send({ message: 'Product Deleted' });
  // } else {
  //   await db.disconnect();
  //   res.status(404).send({ message: 'Product Not Found' });
  // }
  await db.disconnect();
  res.send({ message: 'ResultTotal Deleted' });
});
app.get('/getResultsMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const resultsArr = await Result.find({ date: req.query.date });
  // const resultsArr = await Result.find({});
  // await Btts.deleteMany();
  // console.log('resultsArr', resultsArr);
  await db.disconnect();

  res.json(resultsArr);
});
app.get('/getTodayBetMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const todayBet = await Result.find({ date: req.query.date });
  // const resultsArr = await Result.find({});
  // await Btts.deleteMany();
  // console.log('resultsArr', resultsArr);
  await db.disconnect();

  res.json(todayBet);
});
app.post('/saveStatMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;
  // console.log('req.body', req.body);

  let statObj = req.body;

  statObj.fbp.bttsMisPerc = (100 * (statObj.fbp.total - statObj.fbp.bttsMisArr.length) / statObj.fbp.total).toFixed(2);
  statObj.fbp.over05MisPerc = (100 * (statObj.fbp.total - statObj.fbp.over05MisArr.length) / statObj.fbp.total).toFixed(2);

  statObj.fst.bttsMisPerc = (100 * (statObj.fst.total - statObj.fst.bttsMisArr.length) / statObj.fst.total).toFixed(2);
  statObj.fst.over05MisPerc = (100 * (statObj.fst.total - statObj.fst.over05MisArr.length) / statObj.fst.total).toFixed(2);

  statObj.footy.bttsMisPerc = (100 * (statObj.footy.total - statObj.footy.bttsMisArr.length) / statObj.footy.total).toFixed(2);
  statObj.footy.over05MisPerc = (100 * (statObj.footy.total - statObj.footy.over05MisArr.length) / statObj.footy.total).toFixed(2);

  statObj.accum.bttsMisPerc = (100 * (statObj.accum.total - statObj.accum.bttsMisArr.length) / statObj.accum.total).toFixed(2);
  statObj.accum.over05MisPerc = (100 * (statObj.accum.total - statObj.accum.over05MisArr.length) / statObj.accum.total).toFixed(2);

  statObj.fbpai.bttsMisPerc = (100 * (statObj.fbpai.total - statObj.fbpai.bttsMisArr.length) / statObj.fbpai.total).toFixed(2);
  statObj.fbpai.over05MisPerc = (100 * (statObj.fbpai.total - statObj.fbpai.over05MisArr.length) / statObj.fbpai.total).toFixed(2);

  statObj.mighty.bttsMisPerc = (100 * (statObj.mighty.total - statObj.mighty.bttsMisArr.length) / statObj.mighty.total).toFixed(2);
  statObj.mighty.over05MisPerc = (100 * (statObj.mighty.total - statObj.mighty.over05MisArr.length) / statObj.mighty.total).toFixed(2);

  statObj.passion.bttsMisPerc = (100 * (statObj.passion.total - statObj.passion.bttsMisArr.length) / statObj.passion.total).toFixed(2);
  statObj.passion.over05MisPerc = (100 * (statObj.passion.total - statObj.passion.over05MisArr.length) / statObj.passion.total).toFixed(2);

  statObj.mybets.bttsMisPerc = (100 * (statObj.mybets.total - statObj.mybets.bttsMisArr.length) / statObj.mybets.total).toFixed(2);
  statObj.mybets.over05MisPerc = (100 * (statObj.mybets.total - statObj.mybets.over05MisArr.length) / statObj.mybets.total).toFixed(2);
  console.log('statObj', statObj);
  // mongoose.connect(
  //   'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
  //   {
  //     useNewUrlParser: true,
  //     // useCreateIndex: true,
  //     useUnifiedTopology: true,
  //   }
  // );
  // // const resultsArr = await Result.find({ date: req.query.date });
  // // // const resultsArr = await Result.find({});
  // await Stat.insertMany(statObj);
  // // // console.log('resultsArr', resultsArr);
  // await db.disconnect();
  // res.json('stat inserted');
});
app.post('/saveTodayBetMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;
  // console.log('req.body', req.body);

  
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );
  // // const resultsArr = await Result.find({ date: req.query.date });
  // // // const resultsArr = await Result.find({});
  await TodayBet.save(req.body);
  // // // console.log('resultsArr', resultsArr);
  await db.disconnect();
  console.log('today bet inserted');
  res.json('today bet inserted');
});
// app.post('/saveTotalResultsToMongo', async (req, res) => {
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   await User.insertMany(req.body);

//   // const resultsArr = await ResultTotal.find({"date": req.query.date});
//   // const resultsArr = await Result.find({});
//   // await Btts.deleteMany();
//   console.log('resultsArr', resultsArr);
//   await db.disconnect();

//   res.json(resultsArr);
// });
// app.post('/saveBtts', (req, res) => {
//   console.log('req.body', req.body.data);
//   let data = req.body.data;

//   db.connect();
//   Btts.insertMany(data);
//   db.disconnect();

//   res.end('saved');
// });
// app.get('/getFbpBtts', (req, res) => {});
// app.get('/getAccumBtts', (req, res) => {});
// app.get('/getFstBtts', (req, res) => {});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
