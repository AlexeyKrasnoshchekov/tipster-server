// require express and it's router component
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { getHomeTeamName, formatHomeTeamName } = require('../../utils');

const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const db = require('../../db');
const { Result } = require('../../mongo_schema/Result');
const { ResultTotal } = require('../../mongo_schema/ResultTotal');

const ORIGIN = process.env.ORIGIN;

console.log('ORIGIN', ORIGIN);

const resultRouter = express.Router();

resultRouter.use(cors());
const corsOptions = {
  origin: ORIGIN,
};

const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);
const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
const yesterdayString = formattedYesterday.toString();

const url_result2 = 'https://www.livescore.bz/en/yesterday/';

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
let results = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
resultRouter.get('/delete', cors(corsOptions), async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await Result.deleteMany({ date: yesterdayString });
  console.log('results deleted'); // Success
  await db.disconnect();

  res.send('result deleted')
});
resultRouter.get('/total', cors(corsOptions), async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  let bttsArr = await Btts.find({ date: yesterdayString });
  let sortedBtts = bttsArr.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });
  let resultsArr = await Result.find({ date: yesterdayString });
  let sortedResults = resultsArr.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  // console.log('sortedBtts', sortedBtts)
  // console.log('sortedResults', sortedResults)

  let resultsTotal = [];

  for (let i = 0; i < sortedResults.length; i++) {
    for (let j = 0; j < sortedBtts.length; j++) {
      // const longestSubstring = LCSubStr(sortedResults[i].homeTeam, sortedBtts[j].homeTeam, sortedResults[i].homeTeam.length ,sortedBtts[j].homeTeam.length );

      // console.log('111', longestSubstring)
      // console.log('222', (longestSubstring / sortedResults[i].homeTeam.length))
      // console.log('222', bttsArr[0].homeTeam)
      // console.log('333', LCSubStr(resultsArr[2].homeTeam,bttsArr[0].homeTeam, resultsArr[2].homeTeam.length ,bttsArr[0].homeTeam.length ))
      if (
        resultsArr[i].homeTeam === bttsArr[j].homeTeam ||
        // sortedResults[i].homeTeam.length === sortedBtts[j].homeTeam.length && sortedBtts[j].homeTeam.length === LCSubStr(sortedResults[i].homeTeam,sortedBtts[j].homeTeam, sortedResults[i].homeTeam.length ,sortedBtts[j].homeTeam.length ) ||
        // (longestSubstring / sortedResults[i].homeTeam.length)*100 >= 45
        bttsArr[j].homeTeam.includes(resultsArr[i].homeTeam) ||
        resultsArr[i].homeTeam.includes(bttsArr[j].homeTeam) ||
        resultsArr[i].homeTeam === getHomeTeamName(bttsArr[j].homeTeam)
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

  // console.log('resultsTotal', resultsTotal)
  await ResultTotal.insertMany(resultsTotal)
    .then(function () {
      console.log('ResultsTotal inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  await db.disconnect();

  res.send('total ok')
});

resultRouter.get('/save', cors(corsOptions), async (req, res) => {
  console.log('result111');
  //result2
  await axios(url_result2)
    .then((response) => {
      const html = response.data;

      const $ = cheerio.load(html);

      $('.m', html).each(function () {
        const homeTeam = $(this).find('t1:first').find('t:first').text();
        const awayTeam = $(this).find('t2:first').find('t:first').text();

        const score = $(this).find('sc:first').text();

        if (
          score !== '' &&
          awayTeam !== '' &&
          homeTeam !== '' &&
          yesterdayString !== ''
        ) {
          results.push({
            score,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: yesterdayString,
          });
        }
      });
    })
    .catch((err) => console.log(err));

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  results = results.map((result) => {
    result.homeTeam = formatHomeTeamName(result.homeTeam);
    result.awayTeam = formatHomeTeamName(result.awayTeam);

    result.homeTeam = getHomeTeamName(result.homeTeam);
    result.awayTeam = getHomeTeamName(result.awayTeam);

    return result;
  });

  console.log('results',results);

  await Result.insertMany(results)
    .then(function () {
      console.log('Results inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('result loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = resultRouter;
