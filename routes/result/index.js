// require express and it's router component
const express = require('express');
const fns = require('date-fns');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { getHomeTeamName, formatHomeTeamName } = require('../../utils');


const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../../db');
const { Result } = require('../../mongo_schema/Result');
const { ZeroCounter } = require('../../mongo_schema/ZeroCounter');
const { csProd } = require('../../mongo_schema/prod/CsProd');

const ORIGIN = process.env.ORIGIN;

const resultRouter = express.Router();

resultRouter.use(cors());
const corsOptions = {
  origin: ORIGIN,
};

const today = new Date();
const yesterday = new Date(today);
const tomorrow = new Date(today);
const year = today.getFullYear();

yesterday.setDate(yesterday.getDate() - 1);
tomorrow.setDate(tomorrow.getDate() + 1);
const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
const formattedToday = fns.format(today, 'dd.MM.yyyy');
const todayString = formattedToday.toString();
const yesterdayString = formattedYesterday.toString();
const day = today.getDate();
const dayTom = tomorrow.getDate();

let month = today.getMonth();
month = month < 10 ? `${month + 1}` : month + 1;

const url_result2 = 'https://www.livescore.bz/en/yesterday/';
const url_result3 = `https://www.footlive.com/yesterday/`;

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
let results = [];
let results2 = [];
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

  await Result.deleteMany({ date: req.query.date });
  console.log('results deleted'); // Success
  await db.disconnect();

  res.send('result deleted');
});

resultRouter.get('/get', async (req, res) => {
  console.log('req.query.date222', req.query.date);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const resultsArr = await Result.find({ date: req.query.date });
  await db.disconnect();
    console.log('resultsArr',resultsArr);
  res.json(resultsArr);
});
resultRouter.get('/getZeroResults', async (req, res) => {
  // const Today = new Date();
  // Today.setDate(Today.getDate());
  const SevenDaysAgo = new Date();
  SevenDaysAgo.setDate(SevenDaysAgo.getDate() - 7);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const resultsArr = await Result.find({
    createdAt: {
      $gte: fns.startOfDay(SevenDaysAgo),
      // $lte: endOfDay(new Date())
    },
    score: /0 - 0/i
    // date: '29.11.2023'
  });
  // console.log('resultsArr444',resultsArr.filter(elem => elem.score.includes('0 - 0')));
  // console.log('resultsArr444',resultsArr);
  // console.log('resultsArr555',resultsArr[resultsArr.length - 1].createdAt > SevenDaysAgo)

  // const filResZeros = resultsArr.filter(elem => elem.createdAt > SevenDaysAgo);
  // console.log('resultsArr333',filResZeros)
  await db.disconnect();

  res.json(resultsArr);
});
resultRouter.get('/getCSZeros', async (req, res) => {
  console.log('req.query.date', req.query.dates);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const CSZerosArr = await csProd.find({ result: /0 - 0/i });

  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(CSZerosArr);
});
resultRouter.get('/getCSAll', async (req, res) => {
  console.log('req.query.date', new Date('01/31/2024'));
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  let date = new Date('01/31/2024');

  const CSZerosArr = await csProd.find({
    createdAt: {
      $gte: fns.startOfDay(date),
      // $lte: endOfDay(new Date())
    }
  });

  // let csZerosFil = CSZerosArr.filter(elem => Object.keys(elem).length > 9);

  await db.disconnect();
  console.log('CSZerosArr',CSZerosArr)
  res.json(CSZerosArr);
});

resultRouter.get('/getZeroCounter', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  // console.log('req.query.date', req.query.date);git
  // await ZeroCounter.deleteMany({ });

  const res111 = await ZeroCounter.find({});
  // console.log('getZeroCounterRes111',res111);
  await db.disconnect();

  // console.log('res111', res111);

  res.json(res111);
  // res.json('zerCounter deleted');
});

resultRouter.post('/saveZeroCounter', async (req, res) => {
  let data = req.body;

  console.log('data333', data);

  // data.homeTeam.forEach(async (elem) => {
  //   const newBttsObj = {
  //     source: data.source,
  //     action: data.action,
  //     homeTeam: getHomeTeamName(elem) !== '' ? getHomeTeamName(elem) : elem,
  //     predTeam:
  //       getHomeTeamName(data.predTeam) !== ''
  //         ? getHomeTeamName(data.predTeam)
  //         : data.predTeam,
  //     date: data.date,
  //     isAcca: data.isAcca,
  //   };

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  let newZeroCounter = await new ZeroCounter(data);
  await newZeroCounter.save(function (err) {
    if (err) return console.error(err);
    console.log('zero counter saved succussfully!');
  });

  // // console.log('data.date', data.date);
  // const res111 = await ZeroCounter.find({ date: data.date });
  // // console.log('res111', res111);

  // if (res111 && res111.length !== 0) {
  //   await ZeroCounter.replaceOne(res111[0], data);
  //   console.log('zero counter updated succussfully!');
  // } else {
  //   let newZeroCounter = await new ZeroCounter(data);
  //   await newZeroCounter.save(function (err) {
  //     if (err) return console.error(err);
  //     console.log('new zero counter saved succussfully!');
  //   });
  // }

  // let newZeroCounter = await new ZeroCounter(data);
  // await newZeroCounter.save(function (err) {
  //   if (err) return console.error(err);
  //   console.log('new zero counter saved succussfully!');
  // });

  // await ZeroCounter.deleteMany({});
  await db.disconnect();
  // });
  // console.log('new Over saved succussfully!');

  res.json('zero counter inserted');
});

resultRouter.get('/load', cors(corsOptions), async (req, res) => {
  // console.log('result111', formattedToday);
  console.log('yesterdayString222', req.query.date);
  // //result2
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
          req.query.date !== ''
        ) {
          results2.push({
            score,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: req.query.date,
          });
        }
      });
    })
    .catch((err) => console.log(err));
    console.log('results000', results2);
    

  //result3
  await axios(url_result3)
    .then((response) => {
      const html = response.data;

      const $ = cheerio.load(html);

      $('.feedGame', html).each(function () {
        const homeTeam = $(this).find('.match_event').find('.team_a').text();
        const awayTeam = $(this).find('.match_event').find('.team_b').text();
        const status = $(this).find('.status').text();
        let score = $(this).find('.match_event').find('.score').text();
        score = score.replace(':', '-');

        if ( 
        status === 'Pen' &&
        status === 'Pst' &&
        homeTeam !== '' &&
        req.query.date !== '') {
          // console.log('homeTeam222', homeTeam);

          let penElem = results2.filter(elem => elem.homeTeam === homeTeam || elem.homeTeam.includes(homeTeam) || homeTeam.includes(elem.homeTeam) || elem.homeTeam === getHomeTeamName(homeTeam))[0];
          // console.log('penElem222', penElem);
          if (penElem) {
            results.push({
              score: penElem.score,
              homeTeam: penElem.homeTeam,
              awayTeam: penElem.awayTeam,
              date: req.query.date,
            });
          }
        }
        

        if (
          score !== '' &&
          status !== 'Pen' &&
          status !== 'Pst' &&
          awayTeam !== '' &&
          homeTeam !== '' &&
          req.query.date !== ''
        ) {
          results.push({
            score,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: req.query.date,
          });
        }
      });
    })
    .catch((err) => console.log(err));
    console.log('results333', results);

    try {
      mongoose.connect(
        'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log('Connected to MongoDB');
  } catch (error) {
      console.log('Could not connect to MongoDB');
      throw error;
  }


  // results = results.map((result) => {
  //   result.homeTeam = formatHomeTeamName(result.homeTeam);
  //   result.awayTeam = formatHomeTeamName(result.awayTeam);

  //   result.homeTeam = getHomeTeamName(result.homeTeam);
  //   result.awayTeam = getHomeTeamName(result.awayTeam);

  //   return result;
  // });
  // console.log('results111', results);
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
