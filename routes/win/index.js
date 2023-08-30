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
const { WinData } = require('../../mongo_schema/WinDataModel');

const ORIGIN = process.env.ORIGIN;

console.log('ORIGIN', ORIGIN);

const winRouter = express.Router();

winRouter.use(cors());
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

const url_passion = 'https://passionpredict.com/home-wins';
const url_footsuper =
  'https://www.footballsuper.tips/todays-free-football-super-tips/';
// const url_wdw = 'https://www.windrawwin.com/best-bets-today/';
// const url_bankerHome = 'https://bankerpredict.com/home-wins';
// // const url_bettingtips = 'https://www.bettingtips.today/football-accumulators-tips/';
// const url_bankerAway = 'https://bankerpredict.com/away-wins';
// const url_soccertipz = 'https://www.soccertipz.com/sure-bets-predictions/';
const url_betgenuine_acc = 'https://betgenuine.com/bet-of-the-day/';
// const url_betgenuine = 'https://betgenuine.com/football-predictions/';
const url_footy1 = 'https://footystats.org/predictions/home-wins';
const url_footy2 = 'https://footystats.org/predictions/away-wins';
const url_prot = 'https://www.protipster.com/betting-tips/1x2';
// const url_nvtips = 'https://nvtips.com/ru/';
const url_venasbet = 'https://venasbet.com/double_chance';
const url_r2bet = 'https://r2bet.com/double_chance';

// const url_suresoccer = 'https://www.suresoccerpredict.com/direct-win-prediction/';
// const url_wbo = 'https://www.winonbetonline.com/';
// const url_suretips = 'https://suretipspredict.com/';

const url_hello = 'https://hellopredict.com/Double_chance';
const url_mybets = 'https://www.mybets.today/recommended-soccer-predictions/';
// const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-08-${day}T00:00:00Z&to=2023-08-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=1X,X2&leagueIds=`;
const url_mines1 = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-08-${day}T21:00:00Z&to=2023-08-${dayTom}T21:00:00Z&minOdd=1.1&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=1&leagueIds=`;
const url_mines2 = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-08-${day}T21:00:00Z&to=2023-08-${dayTom}T21:00:00Z&minOdd=1.1&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=2&leagueIds=`;
const url_fbp =
  'https://footballpredictions.net/sure-bets-sure-win-predictions';

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const winData = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
winRouter.get('/delete', cors(corsOptions), async (req, res) => {
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

  await WinData.deleteMany({ date: todayString });
  console.log('Win deleted'); // Success
  res.send('win deleted');
  await db.disconnect();
});

winRouter.get('/save', cors(corsOptions), async (req, res) => {
  console.log('win111');
  //SOCCERTIPZ
  // await axios(url_soccertipz)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('td:nth-child(2)')
  //         .text()
  //         .split(/\r?\n/)[0];
  //       const awayTeam = $(this)
  //         .find('td:nth-child(2)')
  //         .text()
  //         .split(/\r?\n/)[1];

  //       const tip = $(this).find('td:nth-child(3)').text();
  //       const score = $(this).find('td:nth-child(4)').text();

  //       homeTeam &&
  //         homeTeam !== '' &&
  //         awayTeam &&
  //         awayTeam !== '' &&
  //         winData.push({
  //           source: 'soccertipz',
  //           action: `Win score:${score}`,
  //           checked: false,
  //           isAcca: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //           prediction: tip.includes('1') ? homeTeam : awayTeam,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));
  //Betgenuine_Acc
  await axios(url_betgenuine_acc)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      const divsWithAttribute = $('div[data-content-id="today"]');

      //  console.log('divsWithAttribute', divsWithAttribute);

      if (divsWithAttribute) {
        $('tr', divsWithAttribute).each(function () {
          //<-- cannot be a function expression
          // const title = $(this).text();
          const homeTeam = $(this).find('td:nth-child(2)').text();
          const awayTeam = $(this).find('td:nth-child(4)').text();

          //  console.log('000', homeTeam);

          const tip = $(this).find('td:nth-child(5)').text();

          homeTeam &&
            homeTeam !== '' &&
            awayTeam &&
            awayTeam !== '' &&
            winData.push({
              source: 'betgenuine',
              action: tip.includes('X') ? 'XWin' : 'Win',
              checked: false,
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction: tip.includes('1') ? homeTeam : awayTeam,
            });
        });
      }

      // res.json(over25);
    })
    .catch((err) => console.log(err));

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
          (pred.includes('1') || pred.includes('2')) &&
          parseInt(percent) > 74 &&
          winData.push({
            source: 'footsuper',
            action: 'win',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction:
              (pred.includes('1') && homeTeam) ||
              (pred.includes('2') && awayTeam),
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //FBP
  await axios(url_fbp)
    .then((response) => {
      const html = response.data;
      // console.log(response.data);
      // console.log('000', response);
      const $ = cheerio.load(html);

      $('.card-header', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const prediction = $(this).find('.prediction').text();
        let homeTeam = $(this).find('.home-team').find('.team-label').text();
        const awayTeam = $(this).find('.away-team').find('.team-label').text();
        let predictionDate = $(this)
          .find('.match-preview-date')
          .find('.full-cloak')
          .text();

        predictionDate = predictionDate.split(' ')[0];

        homeTeam =
          getHomeTeamName(homeTeam.trim()) !== ''
            ? getHomeTeamName(homeTeam.trim())
            : homeTeam.trim();

        predictionDate.includes(`${day}`) &&
          homeTeam !== '' &&
          prediction !== '' &&
          winData.push({
            source: 'fbp',
            action: 'win',
            homeTeam: homeTeam,
            awayTeam,
            date: todayString,
            prediction: prediction.includes(homeTeam) ? homeTeam : awayTeam,
            predictionDate: predictionDate,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // //PASSION
  await axios(url_passion)
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
        elem !== '' &&
          winData.push({
            source: 'passion',
            action: 'win',
            homeTeam: elem,
            awayTeam: '',
            prediction: elem,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // //BANKER HOME
  // await axios(url_bankerHome)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('td:nth-child(3)')
  //         .find('span:first')
  //         .text()
  //         .split('VS')[0];

  //       const awayTeam = $(this)
  //         .find('td:nth-child(3)')
  //         .find('span:first')
  //         .text()
  //         .split('VS')[1];
  //       const tip = $(this).find('td:nth-child(4)').find('span:first').text();

  //       homeTeam !== '' &&
  //         winData.push({
  //           source: 'banker',
  //           action: tip.includes('1X') ? 'XWin' : 'Win',
  //           checked: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //           prediction:
  //             tip.includes('1') || tip.includes('1X') ? homeTeam : awayTeam,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  // //BANKER AWAY
  // await axios(url_bankerAway)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('td:nth-child(3)')
  //         .find('span:first')
  //         .text()
  //         .split('VS')[0];

  //       const awayTeam = $(this)
  //         .find('td:nth-child(3)')
  //         .find('span:first')
  //         .text()
  //         .split('VS')[1];
  //       const tip = $(this).find('td:nth-child(4)').find('span:first').text();

  //       homeTeam !== '' &&
  //         winData.push({
  //           source: 'banker',
  //           action: tip.includes('2X') ? 'XWin' : 'Win',
  //           checked: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //           prediction:
  //             tip.includes('2') || tip.includes('2X') ? homeTeam : awayTeam,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

   // MINES;
  await axios(url_mines1)
    .then((response) => {
      const data = response.data;

      data.forEach((elem) => {
        elem !== '' && elem.bestOddProbability > 74 &&
          winData.push({
            source: 'mines',
            action: `${elem.bestOdd} ${elem.bestOddProbability}%`,
            homeTeam: elem.localTeam.name,
            awayTeam: elem.visitorTeam.name,
            prediction:
              elem.bestOdd === '2'
                ? elem.visitorTeam.name
                : elem.localTeam.name,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
   // MINES;
  await axios(url_mines2)
    .then((response) => {
      const data = response.data;

      data.forEach((elem) => {
        elem !== '' && elem.bestOddProbability > 74 &&
          winData.push({
            source: 'mines',
            action: `${elem.bestOdd} ${elem.bestOddProbability}%`,
            homeTeam: elem.localTeam.name,
            awayTeam: elem.visitorTeam.name,
            prediction:
              elem.bestOdd === '2'
                ? elem.visitorTeam.name
                : elem.localTeam.name,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // // MYBETS
  await axios(url_mybets)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.linkgames', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        // const homeTeam = $(this).find('.homeTeam').find('span:first').text();
        let homeTeam = $(this).find('.homespan').text();
        let awayTeam = $(this).find('.awayspan').text();

        const prediction = $(this).find('.tipdiv').find('span:first').text();
        let percvalues = $(this).find('.tipdiv').find('.percvalues').text();
        percvalues = percvalues.split('(')[1].split('%')[0];
        percvalues = parseInt(percvalues);

        // console.log('percvalues', percvalues);

        homeTeam = homeTeam.trim();

        awayTeam = awayTeam.trim();

        homeTeam !== '' &&
          prediction !== '' &&
          percvalues > 68 &&
          winData.push({
            source: 'mybets',
            action: 'win',
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            date: todayString,
            prediction: prediction.includes('1') ? homeTeam : awayTeam,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // // FOOTY HOME
  await axios(url_footy1)
    .then((response) => {
      const html = response.data;

      const $ = cheerio.load(html);

      $('.betWrapper', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        // const homeTeam = $(this).find('.homeTeam').find('span:first').text();
        let homeTeam = $(this).find('.betHeaderTitle').text().split(' vs ')[0];
        homeTeam = homeTeam.replace('Home Win ', '');
        let awayTeam = $(this).find('.betHeaderTitle').text().split(' vs ')[1];

        let odds = $(this).find('.odds').text();
        // console.log('odds', odds);
        odds = odds.replace('Odds', '');
        odds = parseFloat(odds);

        // console.log('odds', odds);

        // console.log('percvalues', percvalues);

        homeTeam = homeTeam.trim();

        awayTeam = awayTeam && awayTeam.trim();

        homeTeam !== '' &&
          odds < 1.7 &&
          winData.push({
            source: 'footy',
            action: '1win',
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            date: todayString,
            prediction: homeTeam,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // // FOOTY AWAY
  await axios(url_footy2)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.betWrapper', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        // const homeTeam = $(this).find('.homeTeam').find('span:first').text();
        let homeTeam = $(this).find('.betHeaderTitle').text().split(' vs ')[0];
        homeTeam = homeTeam.replace('Away Win ', '');
        let awayTeam = $(this).find('.betHeaderTitle').text().split(' vs ')[1];

        let odds = $(this).find('.odds').text();
        odds = odds.replace('Odds', '');
        odds = parseFloat(odds);

        // console.log('percvalues', percvalues);

        homeTeam = homeTeam.trim();

        awayTeam = awayTeam.trim();

        homeTeam !== '' &&
          awayTeam !== '' &&
          odds < 1.7 &&
          winData.push({
            source: 'footy',
            action: '2win',
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            date: todayString,
            prediction: awayTeam,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

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
        const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          winData.push({
            source: 'venas',
            action: 'XWin',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction:
              tip.includes('1') || tip.includes('1X') ? homeTeam : awayTeam,
          });
      });

      // res.json(over25);
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

        const tip = $(this).find('.details-pick__match-data__outcome').text();

        homeTeam !== '' &&
          winData.push({
            source: 'prot',
            action: 'win',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction: tip.includes(homeTeam) ? homeTeam : awayTeam,
          });
      });

      // res.json(over25);
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
          winData.push({
            source: 'r2bet',
            action: 'XWin',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction:
              tip.includes('1') || tip.includes('1X') ? homeTeam : awayTeam,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //hello
  await axios(url_hello)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('tr', html).each(function () {
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
        const tip = $(this)
          .find('.tab_b_tips')
          .find('span:first')
          .find('span:first')
          .text();

        homeTeam !== '' &&
          winData.push({
            source: 'hello',
            action: 'XWin',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction:
              tip.includes('1') || tip.includes('1X') ? homeTeam : awayTeam,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  // const optionsHomeWin = {
  //   method: 'GET',
  //   url: 'https://morpheus-predictions.p.rapidapi.com/Best1',
  //   headers: {
  //     'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
  //     'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
  //   },
  // };

  // const optionsAwayWin = {
  //   method: 'GET',
  //   url: 'https://morpheus-predictions.p.rapidapi.com/Best2',
  //   headers: {
  //     'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
  //     'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
  //   },
  // };

  // await axios
  //   .request(optionsHomeWin)
  //   .then(function (response) {
  //     console.log('response.optionsHomeWin', response.data);
  //     const data = response.data;

  //     data.length !== 0 &&
  //       data.forEach((elem) => {
  //         winData.push({
  //           source: 'morph',
  //           action: `win ${elem.probability}`,
  //           isAcca: false,
  //           homeTeam: elem.localTeamName.trim(),
  //           prediction: elem.localTeamName.trim(),
  //           awayTeam: elem.visitorTeamName,
  //           date: todayString,
  //           predictionDate: `morph hits ${elem.hits}`,
  //         });
  //       });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  // await axios
  //   .request(optionsAwayWin)
  //   .then(function (response) {
  //     console.log('response.optionsAwayWin', response.data);
  //     const data = response.data;

  //     data.length !== 0 &&
  //       data.forEach((elem) => {
  //         winData.push({
  //           source: 'morph',
  //           action: `win ${elem.probability}`,
  //           isAcca: elem.probability >= 90,
  //           homeTeam: elem.localTeamName.trim(),
  //           prediction: elem.visitorTeamName.trim(),
  //           awayTeam: elem.visitorTeamName.trim(),
  //           date: todayString,
  //           predictionDate: `morph hits ${elem.hits}`,
  //         });
  //       });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  console.log('winData',winData);

  await WinData.insertMany(winData)
    .then(function () {
      console.log('WinData inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('win loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = winRouter;
