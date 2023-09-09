// require express and it's router component
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { getHomeTeamName } = require('../../utils');

const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const db = require('../../db');
const { Over } = require('../../mongo_schema/Over');

const ORIGIN = process.env.ORIGIN;

const overRouter = express.Router();

overRouter.use(cors());
const corsOptions = {
  origin: ORIGIN,
};

const today = new Date();
const yesterday = new Date(today);
const tomorrow = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);
tomorrow.setDate(tomorrow.getDate() + 1);
const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
const formattedToday = fns.format(today, 'dd.MM.yyyy');
const todayString = formattedToday.toString();
const day = today.getDate();
const dayTom = tomorrow.getDate();
let month = today.getMonth();
month = month < 10 ? `0${month + 1}` : month + 1;

// const url_goalnow = 'https://www.goalsnow.com/over-under-predictions/';
const url_gnow_accum = 'https://www.goalsnow.com/accumulator-over-2.5-goals/';

// const url_vitibet =
//   'https://www.vitibet.com/index.php?clanek=quicktips&sekce=fotbal&lang=en';

const url_soccertipz = 'https://www.soccertipz.com/under-over-2-5-predictions/';
const url_banker = 'https://bankerpredict.com/over-2-5-goals';
const url_prot = 'https://www.protipster.com/betting-tips/over-2.5-goals';
const url_fbp =
  'https://footballpredictions.net/under-over-2-5-goals-betting-tips-predictions';
// const url_accum =
//   'https://footyaccumulators.com/football-tips/over-2-5-trebles';
const url_fst =
  'https://www.freesupertips.com/over-2-5-goals-betting-tips-and-predictions/';
const url_r2bet = 'https://r2bet.com/2_5_goals';
const url_hello = 'https://hellopredict.com/2_5_goals';
// const url_nvtips = 'https://nvtips.com/ru/';
const url_footsuper =
  'https://www.footballsuper.tips/todays-over-under-football-super-tips/';
const url_footsuper_o25 =
  'https://www.footballsuper.tips/football-accumulators-tips/football-tips-match-goals-accumulator/';

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const over25 = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
overRouter.get('/delete', cors(corsOptions), async (req, res) => {
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

  await Over.deleteMany({ date: req.query.date });
  console.log('Over deleted'); // Success
  res.send('over deleted');
  await db.disconnect();
});

overRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('over111');
  //GoalnowAccum
  await axios(url_gnow_accum)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.accasdisplay', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        let homeTeam = $(this).find('.row3:first').find('.whitespace').text();
        const other = $(this)
          .find('.row3:first')
          .find('.whitespace')
          .find('.tooltiptext')
          .text();
        homeTeam =
          homeTeam &&
          homeTeam !== '' &&
          homeTeam.includes(other) &&
          homeTeam.replace(other, '');
        // let homeTeam1 = '';
        // if (homeTeam.includes('2.5 Goals')) {
        //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
        // }
        // const awayTeam = $(this)
        //   .find('.goalsaway')
        //   .text();
        const pred = $(this).find('.row4').find('span:first').text();
        homeTeam !== '' &&
          pred.includes('Over') &&
          over25.push({
            source: 'gnowAcc',
            action: 'over25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam: '',
            date: todayString,
          });
      });

      // res.send('goalnow over loaded');
    })
    .catch((err) => console.log(err));

  //BANKER
  // await axios(url_banker)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   const body = $('section:nth-child(2) tbody', html);

  //   $('tr', body).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this)
  //       .find('td:nth-child(3)')
  //       .find('span:first')
  //       .text()
  //       .split('VS')[0];

  //     const awayTeam = $(this)
  //       .find('td:nth-child(3)')
  //       .find('span:first')
  //       .text()
  //       .split('VS')[1];

  //     homeTeam !== '' &&
  //       over25.push({
  //         source: 'banker',
  //         action: 'over25',
  //         checked: false,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: todayString,
  //       });
  //   });

  //   // res.send('banker over loaded');
  // })
  // .catch((err) => console.log(err));

  //FOOTSUPER
  await axios(url_footsuper)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.pool_list_item', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.homedisp').text();
        const awayTeam = $(this).find('.awaydisp').text();

        const pred = $(this).find('.prediresults').text();
        const percent = $(this).find('.biggestpercen').text();

        homeTeam !== '' &&
          pred.includes('OVER') &&
          parseInt(percent) > 74 &&
          over25.push({
            source: 'footsuper',
            action: 'over25',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('footsuper over loaded');
    })
    .catch((err) => console.log(err));

  //FOOTSUPER_O25
  await axios(url_footsuper_o25)
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
          over25.push({
            source: 'footsuper_o25',
            action: 'over25',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('footsuper_acc over loaded');
    })
    .catch((err) => console.log(err));

  //PROT
  await axios(url_prot)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.details-pick', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const teams = $(this).find('.details-pick__match-data__teams').text();
        const homeTeam = teams.split(' VS ')[0];
        const awayTeam = teams.split(' VS ')[1];

        homeTeam !== '' &&
          over25.push({
            source: 'prot',
            action: 'over25',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('prot over loaded');
    })
    .catch((err) => console.log(err));

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
        const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          tip.includes('Over 2.5') &&
          over25.push({
            source: 'r2bet',
            action: 'over25',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('r2bet over loaded');
    })
    .catch((err) => console.log(err));

  // //VITIBET
  // await axios(url_vitibet)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const date = $(this).find('td:nth-child(1)').text();
  //       const homeTeam = $(this).find('td:nth-child(2)').text();
  //       const awayTeam = $(this).find('td:nth-child(3)').text();
  //       const score1 = $(this).find('td:nth-child(4)').text();
  //       const score2 = $(this).find('td:nth-child(6)').text();

  //       const scoreTotal = score1 * 1 + score2 * 1;

  //       homeTeam !== '' && date.includes(`0${day}.${month}`) &&
  //         scoreTotal >= 3 &&
  //         over25.push({
  //           source: 'vitibet',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //         });
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));

   //hello
   await axios(url_hello)
   .then((response) => {
     const html = response.data;

     // console.log('000', html);
     const $ = cheerio.load(html);

     $('.tab-pane', html).each(function () {
       let date = $(this).find('.game_date').text();

       if (date.split(' ')[1].includes(`${day}`)) {
         console.log('000', date.split(' ')[1].includes(`${day}`));

         $('tr', this).each(function () {
           //<-- cannot be a function expression
           // const title = $(this).text();
           const homeTeam = $(this)
             .find('.tab_b_match')
             .find('span:first')
             .text()
             .split('VS')[0];
           const awayTeam = $(this)
             .find('.tab_b_match')
             .find('span:first')
             .text()
             .split('VS')[1];

           // const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];
           // const tip = $(this).find('td:nth-child(4)').text();

           homeTeam !== '' &&
             over25.push({
               source: 'hello',
               action: 'over25',
               checked: false,
               homeTeam: homeTeam.trim(),
               awayTeam: awayTeam.trim(),
               date: todayString,
             });
         });
       }
     });

     // res.send('hello over loaded');
   })
   .catch((err) => console.log(err));

  // ACCUM
  // await axios(url_accum)
  // .then((response) => {
  //   const html = response.data;
  //   // console.log('000', html);
  //   const $ = cheerio.load(html);
  //   const accumArr = [];

  //   $('.zWPB', html).each(function () {
  //     const accumElem = $(this).find('div:first').text();
  //     const accumDate = $(this).find('.date').text();
  //     // console.log('accumDate', accumDate);
  //     accumArr.push({ team: accumElem, predictionDate: accumDate });
  //   });
  //   // console.log('accumArr', accumArr);
  //   for (let i = 0; i < accumArr.length - 1; i++) {
  //     let accumObj = {
  //       source: 'accum',
  //       action: 'over25',
  //       checked: false,
  //       homeTeam: '',
  //       date: todayString,
  //       predictionDate: '',
  //     };

  //     if (i === 0 || i % 2 === 0) {
  //       // accumObj.homeTeam = accumArr[i].team.trim();
  //       accumObj.homeTeam =
  //         getHomeTeamName(accumArr[i].team.trim()) !== ''
  //           ? getHomeTeamName(accumArr[i].team.trim())
  //           : accumArr[i].team.trim();
  //       accumObj.predictionDate = accumArr[i + 1].predictionDate;
  //     }
  //     // console.log('accumArr[i]', accumArr[i]);
  //     // console.log('accumObj', accumObj);
  //     accumObj.homeTeam !== '' && over25.push(accumObj);
  //   }

  //   res.send('accum over loaded');
  // })
  // .catch((err) => console.log(err));

  //FST
  await axios(url_fst)
    .then((response) => {
      const html = response.data;
      // const over25 = [];
      const $ = cheerio.load(html);

      $('.Leg__title', html).each(function () {
        const pred = $(this).find('.Leg__win').text();
        let homeTeam = '';
        let awayTeam = '';

        homeTeam = $(this).find('.Leg__lose').text().split('vs')[0];
        awayTeam = $(this).find('.Leg__lose').text().split('vs')[1];

        homeTeam !== '' &&
          pred.includes('Over') &&
          over25.push({
            source: 'fst',
            action: 'over25',
            isAcca: true,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.send('fst over loaded');
    })
    .catch((err) => console.log(err));

  // FBP
  await axios(url_fbp)
    .then((response) => {
      const html = response.data;
      // console.log(response.data);
      // console.log('000', response);
      const $ = cheerio.load(html);

      $('.accumulator-row', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();

        const teams = $(this).find('.accumulator-name').text();

        const prediction = $(this)
          .find('.accumulator-name')
          .find('strong')
          .text();

        const homeTeam = teams.includes('vs') && teams.split('vs')[0];
        let awayTeam = teams.includes('vs') && teams.split('vs')[1];
        awayTeam =
          awayTeam.includes(prediction) && awayTeam.replace(prediction, '');

        homeTeam !== '' &&
          prediction.includes('Over') &&
          over25.push({
            source: 'fbp',
            action: 'over25',
            isAcca: true,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam: awayTeam.replace(prediction, ''),
            date: todayString,
          });
      });

      // res.send('fbp over loaded');
    })
    .catch((err) => console.log(err));

  let start = 0;
  let next = 1;

  // console.log('over25',over25);
  let sortedOver = over25.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next < sortedOver.length) {
    if (
      sortedOver[start].homeTeam.trim() === sortedOver[next].homeTeam.trim()
    ) {
      if (
        sortedOver[start].action === sortedOver[next].action &&
        sortedOver[start].source === sortedOver[next].source
      ) {
        sortedOver.splice(next, 1);
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

  await Over.insertMany(sortedOver)
    .then(function () {
      console.log('Over inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('over loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = overRouter;
