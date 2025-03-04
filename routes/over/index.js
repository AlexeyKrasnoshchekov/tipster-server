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
const formattedToday = fns.format(today, 'dd.MM.yyyy');
const todayString = formattedToday.toString();
const yesterday = new Date(today);
const tomorrow = new Date(today);
const year = today.getFullYear();

yesterday.setDate(yesterday.getDate() - 1);
tomorrow.setDate(tomorrow.getDate() + 1);
const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
const formattedTomorrow = fns.format(tomorrow, 'dd.MM.yyyy');

const tomorrowString = formattedTomorrow.toString();
const day = today.getDate();
const dayTom = tomorrow.getDate();

let month = today.getMonth();
month = month < 10 ? `${month + 1}` : month + 1;
let month1 = '';
if (parseInt(month) < 10) {
  month1 = `0${month}`;
} else {
  month1 = month;
}

let day1 = '';
if (parseInt(day) < 10) {
  day1 = `0${day}`;
} else {
  day1 = day;
}

// const url_goalnow = 'https://www.goalsnow.com/over-under-predictions/';
const url_gnow_accum = 'https://www.goalsnow.com/accumulator-over-2.5-goals/';
const url_fbp365 = 'https://footballprediction365.com/over-2-5-predictions';
const url_wininbets = 'https://wininbets.com/under-over-predictions';
const url_passion = `https://passionpredict.com/over-2-5-goals?dt=${year}-${month1}-${day1}`;
const url_predutd =
  'https://predictionsunited.com/football-predictions-and-tips/today/over-2-5-goals';

const url_prot = 'https://www.protipster.com/betting-tips/over-2.5-goals';
const url_kingspredict =
  'https://kingspredict.com/2_5_goals';
const url_kingspredict_acc =
  'https://kingspredict.com/over_3_5_goals';
  // const url_goalie = `https://ai-goalie.com/${day1}.${month1}.${year}.html`;
  const url_fbp2 = 'https://footballpredictions.com/footballpredictions/';
const url_fbp =
  'https://footballpredictions.net/under-over-2-5-goals-betting-tips-predictions';
const url_accum =
  'https://footyaccumulators.com/football-tips/over-2-5-trebles';
const url_fst =
  'https://www.freesupertips.com/over-2-5-goals-betting-tips-and-predictions/';
const url_r2bet = 'https://r2bet.com/2_5_goals';
const url_hello = 'https://hellopredict.com/2_5_goals';
const url_o25tip =
  'https://www.over25tips.com/soccer-stats/high-scoring-matches-today/';

const url_footsuper_o25 =
  'https://www.footballsuper.tips/football-accumulators-tips/football-tips-match-goals-accumulator/';

//OTHER
const url_footsuper =
  'https://www.footballsuper.tips/todays-over-under-football-super-tips/';
const url_banker = 'https://bankerpredict.com/over-2-5-goals';
const url_soccertipz = 'https://www.soccertipz.com/under-over-2-5-predictions/';
const url_vitibet =
  'https://www.vitibet.com/index.php?clanek=quicktips&sekce=fotbal&lang=en';
const url_venasbet = 'https://venasbet.com/over-2-5-goals-prediction';
const url_venasbet35 = 'https://venasbet.com/over_3_5_goals';
// const url_nvtips = 'https://nvtips.com/ru/';
const url_footy = 'https://footystats.org/predictions/over-25-goals';
const url_betprotips = 'https://betprotips.com/football-tips/over-under-tips/';
// const url_leaguelane = 'https://leaguelane.com/over-2-5-goals-accumulator/';
const url_kcpredict = 'https://kcpredict.com/over-2-5-goals-tips';
const url_trustpredict = 'https://trustpredict.com/over-2-5-goals';
const url_betimate = `https://betimate.com/en/football-predictions/under-over-25-goals?date=2024-${month1}-${day1}`;
// const url_mybets =
//   'https://www.mybets.today/soccer-predictions/under-over-2-5-goals-predictions/';
// const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-${month}-${day}T00:00:00Z&to=2023-${month}-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.8&limit=20&minProbability=1&maxProbability=100&odds=OVER_25&leagueIds=`;
// const url_fbpai =
//   'https://footballpredictions.ai/football-predictions/over-under-predictions/';
// const url_wdw = 'https://www.windrawwin.com/accumulator-tips/today/';

// const optionsOver25 = {
//   method: 'GET',
//   url: 'https://morpheus-predictions.p.rapidapi.com/TopOver25',
//   headers: {
//     'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
//     'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
//   },
// };

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const over25 = [];
const over25Vpn = [];
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

// overRouter.get('/loadWithVpn', cors(corsOptions), async (req, res) => {
//   console.log('overWithVpn111');

  // // FBP
  // await axios(url_fbp)
  //   .then((response) => {
  //     const html = response.data;
  //     // console.log(response.data);
  //     // console.log('000', response);
  //     const $ = cheerio.load(html);

  //     $('.accumulator-row', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       const teams = $(this).find('.accumulator-name').text();

  //       const prediction = $(this)
  //         .find('.accumulator-name')
  //         .find('strong')
  //         .text();

  //       const homeTeam = teams.includes('vs') && teams.split('vs')[0];
  //       let awayTeam = teams.includes('vs') && teams.split('vs')[1];
  //       awayTeam =
  //         awayTeam.includes(prediction) && awayTeam.replace(prediction, '');

  //       homeTeam !== '' &&
  //         prediction.includes('Over') &&
  //         over25Vpn.push({
  //           source: 'fbp_acc_o25',
  //           action: 'over25',
  //           isAcca: true,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim(),
  //           awayTeam: awayTeam.replace(prediction, ''),
  //           date: todayString,
  //         });
  //     });

  //     // res.send('fbp over loaded');
  //   })
  //   .catch((err) => console.log(err));

//   //FBP
//   // await axios(url_fbp)
 

//   let start = 0;
//   let next = 1;
//   let sortedOver25 = over25Vpn.sort((a, b) => {
//     if (a.homeTeam < b.homeTeam) {
//       return -1;
//     }
//     if (a.homeTeam > b.homeTeam) {
//       return 1;
//     }
//     return 0;
//   });

//   //удаление дублей
//   while (next < sortedOver25.length) {
//     if (
//       sortedOver25[start].homeTeam.trim() === sortedOver25[next].homeTeam.trim()
//     ) {
//       if (
//         sortedOver25[start].action === sortedOver25[next].action &&
//         sortedOver25[start].source === sortedOver25[next].source
//       ) {
//         sortedOver25.splice(next, 1);
//       }
//     }

//     start++;
//     next++;
//   }

//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   );
//   // console.log('sortedBtts', sortedBtts);
//   await Over.insertMany(sortedOver25)
//     .then(function () {
//       console.log('over VPN inserted'); // Success
//     })
//     .catch(function (error) {
//       console.log(error); // Failure
//     });

//   await db.disconnect();
//   res.send('over VPN loaded');
// });

overRouter.get('/get', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  // const bttsArr = await Btts.find({ date: req.query.date });

  const overArr = await Over.find({ date: req.query.date });
  // const overArr = await Over.find({ source: 'betimate_o25' });
  await db.disconnect();

  // console.log('overArr', overArr)

  // let allData = [];
  // allData = allData.concat(bttsArr).concat(overArr);

  res.json(overArr);
});

overRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('over111', req.query.date);

  // await axios(url_fbp)
  // .then((response) => {
  //   const html = response.data;
  //   // console.log(response.data);
  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('.card-body', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this).find('.home-team').find('.team-label').text();
  //     const awayTeam = $(this).find('.away-team').find('.team-label').text();
  //     const under25text = $(this).find('.prediction').text();
  //     const under25Yes = under25text.includes('Over');
  //     // console.log('over25Fbp', over25);
  //     const predictionDate = $(this)
  //       .find('.match-preview-date')
  //       .find('.full-cloak')
  //       .text();
  //     homeTeam !== '' &&
  //       under25Yes &&
  //       over25.push({
  //         source: 'fbp_o25',
  //         action: 'over25',
  //         checked: false,
  //         homeTeam:
  //           getHomeTeamName(homeTeam.trim()) !== ''
  //             ? getHomeTeamName(homeTeam.trim())
  //             : homeTeam.trim().replace('FC ', ''),
  //         awayTeam,
  //         date: req.query.date,
  //         predictionDate: predictionDate,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

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

        let awayTeam = $(this)
          .find('.row3:not(:first)')
          .find('.whitespace')
          .text();
        const other2 = $(this)
          .find('.row3:not(:first)')
          .find('.whitespace')
          .find('.tooltiptext')
          .text();
        awayTeam =
          awayTeam &&
          awayTeam !== '' &&
          awayTeam.includes(other2) &&
          awayTeam.replace(other2, '');

        const pred = $(this).find('.row4').find('span:first').text();
        homeTeam !== '' &&
          pred.includes('Over') &&
          over25.push({
            source: 'goalnow_o25',
            action: 'over25',
            isAcca: true,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam: awayTeam,
            date: req.query.date,
          });
      });

      // res.send('goalnow over loaded');
    })
    .catch((err) => console.log(err));

   //wininbets
  //  await axios(url_wininbets)
  //  .then((response) => {
  //    const html = response.data;
 
  //    // console.log('000', html);
  //    const $ = cheerio.load(html);
 
  //    // const body = $('section:nth-child(2) tbody', html);
 
  //    $('.tips-grid__item', html).each(function () {
  //      //<-- cannot be a function expression
  //      // const title = $(this).text();
  //      const homeTeam = $(this).find('.tips-card__name-first').text().split(' vs ')[0];
  //      const awayTeam = $(this).find('.tips-card__name-first').text().split(' vs ')[1];
 
  //      const tip = $(this).find('.tips-card__badge').find('span').text().split(' ➤ ')[0];
  //      const odds = $(this).find('.tips-card__badge').find('span').text().split(' ➤ ')[1];
  //      const date = $(this).find('.tips-card__time').find('span').text();
       
  //      let day1 = '';
  //      if (parseInt(dayTom) < 10) {
  //        day1 = `0${dayTom}`;
  //      } else {
  //        day1 = dayTom;
  //      }
 
  //      if (tip.includes('Over 2.5')) {
  //        homeTeam !== '' && parseInt(odds) < 2 && date.includes(`${day1}/${month1}`) &&
  //        over25.push({
  //          source: 'wininbets_o25',
  //          action: 'over25',
  //          isAcca: false,
  //          homeTeam: homeTeam.trim(),
  //          awayTeam: awayTeam.trim(),
  //          date: tomorrowString,
  //        });
  //      }
    
  //    });
 
     // res.send('hello over loaded');
  //  })
  //  .catch((err) => console.log(err));

  //BANKER
  await axios(url_banker)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      const body = $('section:nth-child(2) tbody', html);

      $('tr', body).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:first')
          .text()
          .split('VS')[0];

        const awayTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:first')
          .text()
          .split('VS')[1];

        homeTeam !== '' &&
          over25.push({
            source: 'banker_o25',
            action: 'over25',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: req.query.date,
          });
      });

      //   res.send('banker btts ok');
    })
    .catch((err) => console.log(err));

  // betprotips
  // await axios(url_fbp)
  // await axios(url_betprotips)
  //   .then((response) => {
  //     const html = response.data;
  //     // console.log(response.data);
  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.prediction-card', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       // const homeTeam = $(this).find('.teams').find('.home-team').find('span:nth-child(1)').text();
  //       const homeTeam = $(this).find('.teams').find('.home-team').text();
  //       // console.log('homeTeam000', homeTeam);

  //       const awayTeam = $(this).find('.teams').find('.away-team').text();
  //       // console.log('awayTeam000', awayTeam);
  //       const prediction = $(this)
  //         .find('.advice-row')
  //         .find('div:nth-child(1)')
  //         .text();
  //       // console.log('prediction000', prediction);
  //       const underYes = prediction.includes('Over 2.5');
  //       // console.log('over25Fbp', underYes);

  //       homeTeam !== '' &&
  //         underYes &&
  //         over25.push({
  //           source: 'betprotips_o25',
  //           action: 'over25',
  //           isAcca: true,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim().replace('FC ', ''),
  //           awayTeam,
  //           date: req.query.date,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //leaguelane
  // await axios(url_leaguelane)
  //   .then((response) => {
  //     const html = response.data;
  //     // console.log(response.data);
  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.tip-box', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('div:nth-child(2)')
  //         .find('h2:nth-child(1)')
  //         .text()
  //         .split(' vs ')[0];
  //       const awayTeam = $(this)
  //         .find('div:nth-child(2)')
  //         .find('h2:nth-child(1)')
  //         .text()
  //         .split(' vs ')[1];

  //       homeTeam !== '' &&
  //         over25.push({
  //           source: 'leaguelane_o25',
  //           action: 'over25',
  //           isAcca: true,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim().replace('FC ', ''),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //betimate
  await axios(url_betimate)
    .then((response) => {
      const html = response.data;
      // console.log(response.data);
      //  console.log('000', html);
      const $ = cheerio.load(html);

      $('.prediction-body', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.homeTeam').text();
        //  console.log('homeTeam000', homeTeam);

        const awayTeam = $(this).find('.awayTeam').text();
        const date = $(this).find('.date_bah').text();
        //  console.log('date111', date);
        //  console.log('date222', `${month}/${day}`);

        let probabilityOver = '';

        const prediction = $(this).find('.predict').find('small').text();
        //  console.log('prediction000', prediction);

        const overYes = prediction.includes('Over');

        if (overYes) {
          probabilityOver = $(this)
            .find('.probability')
            .find('div:nth-child(2)')
            .text();
        }
        //  console.log('over25Fbp', probabilityUnder);

        let day1 = '';
        if (parseInt(day) < 10) {
          day1 = `0${day}`;
        } else {
          day1 = day;
        }

        homeTeam !== '' &&
          date.includes(`${month1}/${day1}`) &&
          overYes &&
          parseInt(probabilityOver) > 58 &&
          over25.push({
            source: 'betimate_o25',
            action: `over25 ${probabilityOver}`,
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim().replace('FC ', ''),
            awayTeam,
            date: req.query.date,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //MORPH
  // await axios
  //   .request(optionsOver25)
  //   .then(function (response) {
  //     const data = response.data;

  //     data.length !== 0 &&
  //       data.forEach((elem) => {
  //         over25.push({
  //           source: 'morph_o25',
  //           action: 'over25',
  //           isAcca: true,
  //           homeTeam:
  //             getHomeTeamName(elem.localTeamName.trim()) !== ''
  //               ? getHomeTeamName(elem.localTeamName.trim())
  //               : elem.localTeamName.trim(),
  //           awayTeam: elem.visitorTeamName,
  //           date: todayString,
  //         });
  //       });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  // //O25TIPS
  await axios(url_o25tip)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('tr', html).each(function () {
        const homeTeam = $(this).find('td:nth-child(3)').text();
        const awayTeam = $(this).find('td:nth-child(13)').text();

        // console.log('000', tip);

        homeTeam !== '' &&
          over25.push({
            source: 'o25tip',
            action: 'high score',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: req.query.date,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  //Fbpai
  // await axios(url_fbpai)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.footgame', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       const isOverFbpai = $(this).find('.match-tip-show').text();

  //       if (isOverFbpai === 'Over 2.5') {
  //         const homeTeam = $(this)
  //           .find('a:first')
  //           .attr('title')
  //           .split(' - ')[0];
  //         const awayTeam = $(this)
  //           .find('a:first')
  //           .attr('title')
  //           .split(' - ')[1];
  //         homeTeam !== '' &&
  //           over25.push({
  //             source: 'fbpai_o25',
  //             action: 'over25',
  //             checked: false,
  //             homeTeam:
  //               getHomeTeamName(homeTeam.trim()) !== ''
  //                 ? getHomeTeamName(homeTeam.trim())
  //                 : homeTeam.trim(),
  //             awayTeam,
  //             date: todayString,
  //           });
  //       }
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

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
        if (homeTeam.includes('2.5 Goals')) {
          homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
        }
        const awayTeam = $(this)
          .find('.betHeaderTitle')
          .text()
          .split(' vs ')[1];
        homeTeam1 !== '' &&
          over25.push({
            source: 'footy_o25',
            action: 'over25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam1.trim()) !== ''
                ? getHomeTeamName(homeTeam1.trim())
                : homeTeam1.trim(),
            awayTeam,
            date: req.query.date,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //WDW
  // await axios(url_wdw)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('tr', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this)
  //       .find('td:nth-child(2)')
  //       .find('a:first')
  //       .text()
  //       .split(' v ')[0];
  //     const awayTeam = $(this)
  //       .find('td:nth-child(2)')
  //       .find('a:first')
  //       .text()
  //       .split(' v ')[1];
  //     const bet = $(this)
  //       .find('td:nth-child(3)')
  //       .text();

  //     homeTeam !== '' && bet.includes('Over 2.5') &&
  //     over25.push({
  //         source: 'wdw',
  //         action: 'over25',
  //         checked: false,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: todayString,
  //       });
  //     homeTeam !== '' && bet.includes('Over 3.5') &&
  //     over25.push({
  //         source: 'wdw',
  //         action: 'over35',
  //         checked: false,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: todayString,
  //       });
  //   });

  // //   res.send('banker btts ok');
  // })
  // .catch((err) => console.log(err));

  // MYBETS
  // await axios(url_mybets)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.linkgames', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       // const homeTeam = $(this).find('.homeTeam').find('span:first').text();
  //       const homeTeam = $(this).find('.homespan').text();
  //       const awayTeam = $(this).find('.awayspan').text();
  //       const over25text = $(this).find('.tipdiv').find('span:first').text();
  //       const over25Yes = over25text === 'Over';
  //       // console.log('over25Mybets', over25);

  //       // if (homeTeam.trim() === 'Accrington ST') {
  //       //   console.log('over25 HT', getHomeTeamName(homeTeam.trim()))
  //       // };

  //       homeTeam !== '' &&
  //         over25Yes &&
  //         over25.push({
  //           source: 'mybets_o25',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim().replace('FC ', ''),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //NVTIPS
  // await axios(
  //   url_nvtips
  // )
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);
  //     let homeTeamsArr = [];

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('td:nth-child(6)')
  //         .text();
  //       const overYes = $(this)
  //         .find('td:nth-child(13)')
  //         .find('strong:first')
  //         .text();

  //       // const awayTeam = $(this).find('tr').find('td:nth-child(3)').find('span:first').text().split(' "" ')[1].split(' VS')[1];
  //       // const awayTeam = $(this).find('.mtl-index-page-matches__name').text().split(' vs ')[1];
  //       // const predicDate = $(this).find('.mtl-index-page-matches__date').find('p:first').find('time:first').text();
  //       // console.log('homeTeamPass', homeTeam);
  //       if (overYes.includes('Более')) {
  //         homeTeamsArr.push(homeTeam);
  //       }
  //     });
  //     // console.log('homeTeamsArr', homeTeamsArr);
  //     homeTeamsArr.splice(0, 1);
  //     // console.log('homeTeamsArr111', homeTeamsArr);
  //     let indexOfEmpty = homeTeamsArr.indexOf('');
  //     // console.log('indexOfEmpty', indexOfEmpty);
  //     let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
  //     // console.log('todayHomeTeamsArr', todayHomeTeamsArr);
  //     todayHomeTeamsArr.forEach((elem) => {
  //       elem !== '' &&
  //       over25.push({
  //           source: 'nvtips',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(elem) !== '' ? getHomeTeamName(elem) : elem,
  //           awayTeam: '',
  //           date: todayString,
  //         });
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));

  //venasbet
  await axios(url_venasbet)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('tr', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('td:nth-child(3)').text().split('VS')[0];

        const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];

        homeTeam !== '' &&
          over25.push({
            source: 'venas_o25',
            action: 'over25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam:
              getHomeTeamName(awayTeam.trim()) !== ''
                ? getHomeTeamName(awayTeam.trim())
                : awayTeam.trim(),
            date: req.query.date,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));
  

  //PASSION
  await axios(url_passion)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);
      // let pred;

      $('tr', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:first')
          .text()
          .split(' VS')[0];
        const awayTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:first')
          .text()
          .split(' VS')[1];

        let pred = $(this).find('td:nth-child(4)').find('span:first').text();

        homeTeam !== '' &&
          pred !== '' &&
          pred.includes('Over') &&
          over25.push({
            source: 'passion_o25',
            action: 'over25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: req.query.date,
          });
      });
      // console.log('homeTeamsArr', homeTeamsArr);
      // homeTeamsArr.splice(0, 1);
      // // console.log('homeTeamsArr111', homeTeamsArr);
      // let indexOfEmpty = homeTeamsArr.indexOf('');
      // // console.log('indexOfEmpty', indexOfEmpty);
      // let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
      // console.log('homeTeamsArr', homeTeamsArr);

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //PREDUTD
  // await axios(url_predutd)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     const body = $('#mainRow', html)
  //       .find('div:nth-child(2)')
  //       .find('div:nth-child(1)');

  //     $('div', body).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('thead:nth-child(1)')
  //         .find('th')
  //         .text()
  //         .split(' - ')[0];
  //       let awayTeam = $(this)
  //         .find('thead:nth-child(1)')
  //         .find('th')
  //         .text()
  //         .split(' - ')[1];
  //       let part = $(this)
  //         .find('thead:nth-child(1)')
  //         .find('th')
  //         .find('.text-muted')
  //         .text();
  //       awayTeam = awayTeam.replace(`${part}`, '');

  //       homeTeam !== '' &&
  //         over25.push({
  //           source: 'predutd_o25',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: req.query.date,
  //         });
  //     });

  //     // res.send('banker over loaded');
  //   })
  //   .catch((err) => console.log(err));

  //SOCCERTIPZ
  await axios(url_soccertipz)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('tr', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('td:nth-child(2)')
          .text()
          .split(/\r?\n/)[0];
        const awayTeam = $(this)
          .find('td:nth-child(2)')
          .text()
          .split(/\r?\n/)[1];

        const tip = $(this).find('td:nth-child(3)').text();

        homeTeam &&
          homeTeam !== '' &&
          awayTeam &&
          awayTeam !== '' &&
          tip.includes('Over') &&
          over25.push({
            source: 'soccertipz_o25',
            action: 'over25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam:
              getHomeTeamName(awayTeam.trim()) !== ''
                ? getHomeTeamName(awayTeam.trim())
                : awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  // //MINES
  // await axios(url_mines)
  //   .then((response) => {
  //     const data = response.data;

  //     data.forEach((elem) => {
  //       elem !== '' &&
  //         elem.bestOddProbability > 79 &&
  //         over25.push({
  //           source: 'mines_o25',
  //           action: `${elem.bestOdd} ${elem.bestOddProbability}%`,
  //           homeTeam: elem.localTeam.name,
  //           awayTeam: elem.visitorTeam.name,
  //           date: todayString,
  //           isAcca: false,
  //         });
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));

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
            source: 'footsuper_o25',
            action: 'over25',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: req.query.date,
          });
      });

      // res.send('footsuper over loaded');
    })
    .catch((err) => console.log(err));

  

  //PROT
  // await axios(url_prot)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.details-pick', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const teams = $(this).find('.details-pick__match-data__teams').text();
  //       const homeTeam = teams.split(' VS ')[0];
  //       const awayTeam = teams.split(' VS ')[1];

  //       homeTeam !== '' &&
  //         over25.push({
  //           source: 'prot_o25',
  //           action: 'over25',
  //           isAcca: true,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: req.query.date,
  //         });
  //     });

  //     // res.send('prot over loaded');
  //   })
  //   .catch((err) => console.log(err));

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
            source: 'r2bet_o25',
            action: 'over25',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: req.query.date,
          });
      });

      // res.send('r2bet over loaded');
    })
    .catch((err) => console.log(err));

  //fbp365
  // await axios(url_fbp365)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('div[data-testid="statsTip"]', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       // const homeTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(1)').text();
  //       // const awayTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(2)').text();

  //       const homeTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(1)').find('div').text();
  //   //  console.log('homeTeam000', homeTeam.trim());
  //    const awayTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(2)').find('div').text();
  //   //  console.log('awayTeam000', awayTeam.trim());
  //   //  const tip = $(this).find('div:nth-child(3)').find('div:nth-child(1)').text();
  //   //  console.log('tip000', tip);

  //       homeTeam !== '' &&
  //         over25.push({
  //           source: 'fbp365_o25',
  //           action: 'over25',
  //           isAcca: true,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: req.query.date,
  //         });
  //     });

  //     // res.send('r2bet over loaded');
  //   })
  //   .catch((err) => console.log(err));

  //VITIBET
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

  //       homeTeam !== '' &&
  //         date.includes(`${day}.${month}`) &&
  //         scoreTotal >= 3 &&
  //         over25.push({
  //           source: 'vitibet_o25',
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
          // console.log('000', date.split(' ')[1].includes(`${day1}`));

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
                source: 'hello_o25',
                action: 'over25',
                isAcca: false,
                homeTeam: homeTeam.trim(),
                awayTeam: awayTeam.trim(),
                date: req.query.date,
              });
          });
        }
      });

      // res.send('hello over loaded');
    })
    .catch((err) => console.log(err));

  //kcpredict
  await axios(url_kcpredict)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      const body = $('section:nth-child(2) tbody', html);

      $('tr', body).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('td:nth-child(2)')
          .find('span:first')
          .text()
          .split('VS')[0];
        const awayTeam = $(this)
          .find('td:nth-child(2)')
          .find('span:first')
          .text()
          .split('VS')[1];

        // const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];
        // const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          over25.push({
            source: 'kcpredict_o25',
            action: 'over25',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: req.query.date,
          });
      });

      // res.send('hello over loaded');
    })
    .catch((err) => console.log(err));

  //trustpredict
  await axios(url_trustpredict)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      const body = $('section:nth-child(2) tbody', html);

      $('tr', body).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:first')
          .text()
          .split('VS')[0];
        const awayTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:first')
          .text()
          .split('VS')[1];

        // const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];
        // const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          over25.push({
            source: 'trustpredict_o25',
            action: 'over25',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: req.query.date,
          });
      });

      // res.send('hello over loaded');
    })
    .catch((err) => console.log(err));

    // kingspredict
  // await axios(url_kingspredict)
  // .then((response) => {
  //   const html = response.data;      
  //   const $ = cheerio.load(html);

  //   const body = $('.content', html);

  //   $('tr', body).each(function () {

  //     const homeTeam = $(this).find('td:nth-child(3)').find('span:nth-child(1)').text().split('VS')[0];
  //     const awayTeam = $(this).find('td:nth-child(3)').find('span:nth-child(1)').text().split('VS')[1];

  //     const tip = $(this).find('td:nth-child(4)').find('span:nth-child(1)').text();

  //     // console.log('homeTeam2222', homeTeam);
  //     // console.log('awayTeam2222', awayTeam);
  //     // console.log('tip2222', tip);

  //     if (tip.includes('+2.5')) {
  //       homeTeam !== '' &&
  //       over25.push({
  //         source: 'kingspredict_o25',
  //         action: 'over25',
  //         checked: false,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: req.query.date,
  //       });
  //     } 

  //   });

  //   // res.json(btts);
  // })
  // .catch((err) => console.log(err));

  //FBP2
  await axios(url_fbp2)
  .then((response) => {
    const html = response.data;
    // console.log(response.data);
    // console.log('000', html);
    const $ = cheerio.load(html);

    $('.divTableRow', html).each(function () {
      //<-- cannot be a function expression
      // const title = $(this).text();
      // const homeTeam = $(this).find('.teams').find('.home-team').find('span:nth-child(1)').text();
      const homeTeam = $(this).find('.divTableCell1').find('.teamnaam').text();
      // console.log('homeTeam000', homeTeam);

      const awayTeam = $(this).find('.divTableCell3').find('.teamnaam').text();
      // console.log('awayTeam000', awayTeam);
      let score = $(this).find('.divTableCell2').find('.divTableCell2').find('span:nth-child(1)').text();
      score = score.replace('Prediction:', '');

      const score1 = score.split('-')[0];
      const score2 = score.split('-')[1];
      // console.log('homeTeam000', homeTeam);
      // console.log('awayTeam000', awayTeam);
      // console.log('score000', score.trim());

      const isDraw = score1 * 1 === score2 * 1;
      const homeScore = score1 > 0;
      const awayScore = score2 > 0;

      const bttsYes = homeScore && awayScore;
      const scoreTotal = score1 * 1 + score2 * 1;
      const win1 = score1 * 1 > score2 * 1;
      const win2 = score1 * 1 < score2 * 1;

      // homeTeam !== '' &&
      //   btts.push({
      //     source: 'fbp2_btts',
      //     action: bttsYes ? 'btts' : 'btts no',
      //     isAcca: false,
      //     homeTeam: homeTeam.trim(),
      //     awayTeam: awayTeam.trim(),
      //     date: req.query.date,
      //   });
      // homeTeam !== '' &&
      //   isDraw &&
      //   draws.push({
      //     source: 'fbp2_draw',
      //     action: 'draws',
      //     isAcca: false,
      //     homeTeam: homeTeam.trim(),
      //     awayTeam: awayTeam.trim(),
      //     date: req.query.date,
      //   });
        if (scoreTotal >= 3) {
          homeTeam !== '' &&
          over25.push({
              source: 'fbp2_o25',
              action: 'over25',
              checked: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: req.query.date,
            });
        }
        // if (scoreTotal <= 2) {
        //   homeTeam !== '' &&
        //   under25.push({
        //       source: 'fbp2_u25',
        //       action: 'under25',
        //       isAcca: false,
        //       homeTeam: homeTeam.trim(),
        //       awayTeam: awayTeam.trim(),
        //       date: req.query.date,
        //     });
        // }
        // if (win1 || win2) {
        //   homeTeam !== '' &&
        //   winData.push({
        //       source: 'fbp2_win',
        //       action: 'win',
        //       checked: false,
        //       homeTeam: homeTeam.trim(),
        //       awayTeam: awayTeam.trim(),
        //       date: req.query.date,
        //       prediction: win1 ? homeTeam.trim() : awayTeam.trim(),
        //     });
        // }
    });

    // res.json(over25);
  })
  .catch((err) => console.log(err));

  //goalie
  // await axios(url_goalie)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   // const body = $('section:nth-child(2) tbody', html);

  //   $('tr', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this).find('.team').find('.home-team').text();
  //    //  console.log('homeTeam888',homeTeam);
  //     const awayTeam = $(this).find('.team').find('.away-team').text();
  //    //  console.log('awayTeam888',awayTeam);
  //     const total = $(this).find('.gp').text();
  //    //  console.log('total888',total);
  //     // const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];
  //     if (total.includes('3.') || total.includes('2.5') || total.includes('4.')) {
  //      homeTeam !== '' &&
  //      over25.push({
  //        source: 'goalie',
  //        action: 'over25',
  //        checked: false,
  //        homeTeam:
  //          getHomeTeamName(homeTeam.trim()) !== ''
  //            ? getHomeTeamName(homeTeam.trim())
  //            : homeTeam.trim(),
  //        awayTeam:
  //          getHomeTeamName(awayTeam.trim()) !== ''
  //            ? getHomeTeamName(awayTeam.trim())
  //            : awayTeam.trim(),
  //        date: req.query.date,
  //      });
  //     }
  //     // if (total.includes('0.')) {
  //     //  homeTeam !== '' &&
  //     //  under25.push({
  //     //    source: 'goalie',
  //     //    action: 'under25',
  //     //    checked: false,
  //     //    homeTeam:
  //     //      getHomeTeamName(homeTeam.trim()) !== ''
  //     //        ? getHomeTeamName(homeTeam.trim())
  //     //        : homeTeam.trim(),
  //     //    awayTeam:
  //     //      getHomeTeamName(awayTeam.trim()) !== ''
  //     //        ? getHomeTeamName(awayTeam.trim())
  //     //        : awayTeam.trim(),
  //     //    date: req.query.date,
  //     //  });
  //     // }
            
  //    });
   
  //  //  });

  //  //  res.send('goalie over loaded');
  // })
  // .catch((err) => console.log(err));


  // kingspredict_acc
  await axios(url_kingspredict_acc)
    .then((response) => {
      const html = response.data;      
      const $ = cheerio.load(html);

      const body = $('.content', html);

      // console.log('body2222', body);

      $('tr', body).each(function () {

        const homeTeam = $(this).find('td:nth-child(3)').find('span:nth-child(1)').text().split('VS')[0];
        const awayTeam = $(this).find('td:nth-child(3)').find('span:nth-child(1)').text().split('VS')[1];

        const tip = $(this).find('td:nth-child(4)').text();

        // console.log('homeTeam2222', homeTeam);
        // console.log('awayTeam2222', awayTeam);
        // console.log('tip2222', tip);

        if (tip.includes('+3.5')) {
          homeTeam !== '' &&
          over25.push({
            source: 'kingspredict_acc_o25',
            action: 'over25',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: req.query.date,
          });
        } 

      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // ACCUM
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
        source: 'accum_o25',
        action: 'over25',
        checked: false,
        homeTeam: '',
        date: req.query.date,
        predictionDate: '',
      };

      if (i === 0 || i % 2 === 0) {
        // accumObj.homeTeam = accumArr[i].team.trim();
        accumObj.homeTeam =
          getHomeTeamName(accumArr[i].team.trim()) !== ''
            ? getHomeTeamName(accumArr[i].team.trim())
            : accumArr[i].team.trim();
        accumObj.predictionDate = accumArr[i + 1].predictionDate;
      }
      // console.log('accumArr[i]', accumArr[i]);
      // console.log('accumObj', accumObj);
      accumObj.homeTeam !== '' && over25.push(accumObj);
    }

    res.send('accum over loaded');
  })
  .catch((err) => console.log(err));

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
            source: 'fst_o25',
            action: 'over25',
            isAcca: true,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: req.query.date,
          });
      });

      // res.send('fst over loaded');
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
  // console.log('sortedOver', sortedOver);
  console.log('Over inserted111');
  await Over.insertMany(sortedOver)
    .then(function () {
      console.log('Over inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  // res.send('over loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = overRouter;
