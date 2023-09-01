// require express and it's router component
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const fns = require('date-fns');
const db = require('../../db');
const { ResultTotal } = require('../../mongo_schema/ResultTotal');
const { Btts } = require('../../mongo_schema/Btts');
const { Result } = require('../../mongo_schema/Result');
const { getHomeTeamName } = require('../../utils');

const ORIGIN = process.env.ORIGIN;

const totalRouter = express.Router();

totalRouter.use(cors());
const corsOptions = {
  origin: ORIGIN,
};

const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);
const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
const yesterdayString = formattedYesterday.toString();

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
totalRouter.get('/get', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const resultsArr = await ResultTotal.find({ date: req.query.date });
  await db.disconnect();

  res.json(resultsArr);
});

totalRouter.get('/save', cors(corsOptions), async (req, res) => {
  console.log('total111');

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

  let resultsTotal = [];

  for (let i = 0; i < sortedResults.length; i++) {
    for (let j = 0; j < sortedBtts.length; j++) {
      if (
        resultsArr[i].homeTeam === bttsArr[j].homeTeam ||
        // sortedResults[i].homeTeam.length === sortedBtts[j].homeTeam.length && sortedBtts[j].homeTeam.length === utils.LCSubStr(sortedResults[i].homeTeam,sortedBtts[j].homeTeam, sortedResults[i].homeTeam.length ,sortedBtts[j].homeTeam.length ) ||
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

  res.send('total loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = totalRouter;
