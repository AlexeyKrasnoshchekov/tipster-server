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
const year = today.getFullYear();
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

const url_passion = `https://passionpredict.com/home-wins?dt=${year}-${month}-${day}`;
const url_predutd =
  'https://predictionsunited.com/football-predictions-and-tips/today/outcome';
const url_banker1 = 'https://bankerpredict.com/home-wins';
const url_banker2 = 'https://bankerpredict.com/away-wins';
const url_wininbets = 'https://wininbets.com/1x2-predictions';
const url_soccertipz = 'https://www.soccertipz.com/sure-bets-predictions/';
const url_kcpredict = 'https://kcpredict.com/double-chance-tips';
const url_fbp365 = 'https://footballprediction365.com/win-treble-tips';
const url_trustpredict = 'https://trustpredict.com/double-chance';
const url_footsuper =
  'https://www.footballsuper.tips/todays-free-football-super-tips/';
const url_kingspredict = 'https://kingspredict.com/Double_chance';

// const url_wdw = 'https://www.windrawwin.com/best-bets-today/';
// const url_bankerHome = 'https://bankerpredict.com/home-wins';
// // const url_bettingtips = 'https://www.bettingtips.today/football-accumulators-tips/';
// const url_bankerAway = 'https://bankerpredict.com/away-wins';
// const url_soccertipz = 'https://www.soccertipz.com/sure-bets-predictions/';

// const url_betgenuine_acc = 'https://betgenuine.com/sure-win-prediction-today';
const url_o25tips = 'https://www.over25tips.com/soccer-stats/must-win-teams/';
const url_vitibet =
  'https://www.vitibet.com/index.php?clanek=tipoftheday&sekce=fotbal&lang=en';
// const url_betgenuine = 'https://betgenuine.com/football-predictions/';
const url_footy1 = 'https://footystats.org/predictions/home-wins';
const url_footy2 = 'https://footystats.org/predictions/away-wins';
const url_prot = 'https://www.protipster.com/betting-tips/1x2';
// const url_nvtips = 'https://nvtips.com/ru/';
const url_venasbet = 'https://venasbet.com/double_chance';
const url_r2bet = 'https://r2bet.com/double_chance';
const url_betimate = `https://betimate.com/en/football-predictions/predictions-1x2?date=2023-${month}-${day}`;

// const url_suresoccer = 'https://www.suresoccerpredict.com/direct-win-prediction/';
// const url_wbo = 'https://www.winonbetonline.com/';
// const url_suretips = 'https://suretipspredict.com/';

const url_hello = 'https://hellopredict.com/Double_chance';
const url_mybets = 'https://www.mybets.today/recommended-soccer-predictions/';
// const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-08-${day}T00:00:00Z&to=2023-08-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=1X,X2&leagueIds=`;
const url_mines1 = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-${month}-${day}T21:00:00Z&to=2023-${month}-${dayTom}T21:00:00Z&minOdd=1.1&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=1&leagueIds=`;
const url_mines2 = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-${month}-${day}T21:00:00Z&to=2023-${month}-${dayTom}T21:00:00Z&minOdd=1.1&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=2&leagueIds=`;
const url_fbp =
  'https://footballpredictions.net/sure-bets-sure-win-predictions';

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const winData = [];
const winDataVpn = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
winRouter.get('/delete', cors(corsOptions), async (req, res) => {
  // const today = new Date()
  // const formattedToday = fns.format(today, 'dd.MM.yyyy');
  // const todayString = formattedToday.toString();

  console.log('req.query.date', req.query.date);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await WinData.deleteMany({ date: req.query.date });
  console.log('Win deleted'); // Success
  res.send('win deleted');
  await db.disconnect();
});

winRouter.get('/get', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const winDataArr = await WinData.find({ date: req.query.date });
  await db.disconnect();

  res.json(winDataArr);
});

winRouter.post('/save', async (req, res) => {
  let data = req.body;

  if (data.homeTeam.length !== 0) {
    data.homeTeam.forEach(async (elem) => {
      const newWinObj = {
        source: data.source,
        action: data.action,
        homeTeam: getHomeTeamName(elem) !== '' ? getHomeTeamName(elem) : elem,
        prediction:
          getHomeTeamName(data.prediction) !== ''
            ? getHomeTeamName(data.prediction)
            : data.prediction,
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
      let newWin = await new WinData(newWinObj);
      await newWin.save(function (err) {
        if (err) return console.error(err);
        console.log('new Win saved succussfully!');
      });

      await db.disconnect();
    });
    console.log('new preds saved succussfully!');
  }

  res.json('new preds inserted');
});

winRouter.get('/loadWithVpn', cors(corsOptions), async (req, res) => {
  console.log('winWithVpn111');

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
          winDataVpn.push({
            source: 'fbp_win',
            action: 'win',
            homeTeam: homeTeam,
            isAcca: true,
            awayTeam,
            date: todayString,
            prediction: prediction.includes(homeTeam) ? homeTeam : awayTeam,
            predictionDate: predictionDate,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  let start = 0;
  let next = 1;
  let sortedWin = winDataVpn.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next < sortedWin.length) {
    if (sortedWin[start].homeTeam.trim() === sortedWin[next].homeTeam.trim()) {
      if (
        sortedWin[start].action === sortedWin[next].action &&
        sortedWin[start].source === sortedWin[next].source
      ) {
        sortedWin.splice(next, 1);
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
  // console.log('sortedBtts', sortedBtts);
  await WinData.insertMany(sortedWin)
    .then(function () {
      console.log('Win VPN inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('win VPN loaded');
});

winRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('win111');
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
        // const score = $(this).find('td:nth-child(4)').text();

        homeTeam &&
          homeTeam !== '' &&
          awayTeam &&
          awayTeam !== '' &&
          winData.push({
            source: 'soccertipz_win',
            action: `win`,
            checked: false,
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction: tip.includes('1') ? homeTeam : awayTeam,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));
  //Betgenuine_Acc
  // await axios(url_betgenuine_acc)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     const divsWithAttribute = $('div[data-content-id="today"]');

  //     //  console.log('divsWithAttribute', divsWithAttribute);

  //     if (divsWithAttribute) {
  //       $('tr', divsWithAttribute).each(function () {
  //         //<-- cannot be a function expression
  //         // const title = $(this).text();
  //         const homeTeam = $(this).find('td:nth-child(2)').text();
  //         const awayTeam = $(this).find('td:nth-child(4)').text();

  //         //  console.log('000', homeTeam);

  //         const tip = $(this).find('td:nth-child(5)').text();

  //         homeTeam &&
  //           homeTeam !== '' &&
  //           awayTeam &&
  //           awayTeam !== '' &&
  //           winData.push({
  //             source: 'betgenuine',
  //             action: tip.includes('X') ? 'xwin' : 'Win',
  //             checked: false,
  //             isAcca: false,
  //             homeTeam: homeTeam.trim(),
  //             awayTeam: awayTeam.trim(),
  //             date: todayString,
  //             prediction: tip.includes('1') ? homeTeam : awayTeam,
  //           });
  //       });
  //     }

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //BANKER1
  await axios(url_banker1)
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
          winData.push({
            source: 'banker_win',
            action: 'win',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction: homeTeam.trim(),
          });
      });

      //   res.send('banker btts ok');
    })
    .catch((err) => console.log(err));
  //BANKER2
  await axios(url_banker2)
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
          winData.push({
            source: 'banker_win',
            action: 'win',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction: awayTeam.trim(),
          });
      });

      //   res.send('banker btts ok');
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
        const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          winData.push({
            source: 'kcpredict_win',
            action: 'xwin',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction: tip.includes('1X') ? homeTeam : awayTeam,
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
        const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          winData.push({
            source: 'trustpredict_win',
            action: tip.includes('1X') ? 'xwin' : 'win',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction:
              tip.includes('1') || tip.includes('1X') ? homeTeam : awayTeam,
          });
      });

      // res.send('hello over loaded');
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
          parseInt(percent) > 69 &&
          winData.push({
            source: 'footsuper_win',
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
        homeTeamsArr.push(homeTeam);
      });
      homeTeamsArr.splice(0, 1);
      let indexOfEmpty = homeTeamsArr.indexOf('');
      let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
      todayHomeTeamsArr.forEach((elem) => {
        elem !== '' &&
          winData.push({
            source: 'passion_win',
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

  // //O25TIPS
  await axios(url_o25tips)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('table', html).each(function () {
        const caption = $(this).find('caption').text();
        //<-- cannot be a function expression
        // const title = $(this).text();
        if (caption.includes('Today')) {
          $('tr', this).each(function () {
            const homeTeam = $(this)
              .find('td:nth-child(3)')
              .find('div:first')
              .find('span:first')
              .text();
            const awayTeam = $(this)
              .find('td:nth-child(3)')
              .find('div:first')
              .find('span:nth-child(2)')
              .text();

            const tip = $(this)
              .find('td:first')
              .find('div:first')
              .find('span:first')
              .text();

            // console.log('000', tip);

            homeTeam !== '' &&
              tip !== '' &&
              winData.push({
                source: 'o25tip_win',
                action: 'win',
                isAcca: true,
                homeTeam: homeTeam.trim(),
                awayTeam: awayTeam.trim(),
                date: todayString,
                prediction: tip,
              });
          });
        }
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

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

        let probabilityWin = '';

        const prediction = $(this).find('.predict').find('span').text();
        //  console.log('prediction000', prediction);

        const win1Yes = prediction.includes('1');
        const win2Yes = prediction.includes('2');

        if (win1Yes || win2Yes) {
          probabilityWin = win1Yes
            ? $(this).find('.probability').find('div:nth-child(1)').text()
            : $(this).find('.probability').find('div:nth-child(3)').text();
        }
        //  console.log('over25Fbp', probabilityUnder);

        let day1 = '';
        if (parseInt(day) < 10) {
          day1 = `0${day}`;
        } else {
          day1 = day;
        }

        (homeTeam !== '' && date.includes(`${month}/${day1}`) && win1Yes) ||
          (win2Yes &&
            winData.push({
              source: 'betimate_win',
              // action: `win ${probabilityWin}`,
              action: `win`,
              checked: false,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim().replace('FC ', ''),
              awayTeam,
              date: todayString,
              prediction: win1Yes ? homeTeam : awayTeam,
            }));
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //wininbets
  await axios(url_wininbets)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      // const body = $('section:nth-child(2) tbody', html);

      $('.tips-grid__item', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('.tips-card__name-first')
          .text()
          .split(' vs ')[0];
        const awayTeam = $(this)
          .find('.tips-card__name-first')
          .text()
          .split(' vs ')[1];

        const tip = $(this)
          .find('.tips-card__badge')
          .find('span')
          .text()
          .split(' ➤ ')[0];
        const odds = $(this)
          .find('.tips-card__badge')
          .find('span')
          .text()
          .split(' ➤ ')[1];
        const date = $(this).find('.tips-card__time').find('span').text();

        let day1 = '';
        if (parseInt(day) < 10) {
          day1 = `0${day}`;
        } else {
          day1 = day;
        }

        if (tip.trim() === '1') {
          homeTeam !== '' &&
            parseInt(odds) < 2 &&
            date.includes(`${day1}/${month1}`) &&
            winData.push({
              source: 'wininbets_win',
              action: 'win',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction:
                tip.trim() === '1' ? homeTeam.trim() : awayTeam.trim(),
            });
        }
        if (tip.trim() === '2') {
          homeTeam !== '' &&
            parseInt(odds) < 2 &&
            date.includes(`${day1}/${month1}`) &&
            winData.push({
              source: 'wininbets_win',
              action: 'win',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction:
                tip.trim() === '2' ? awayTeam.trim() : homeTeam.trim(),
            });
        }
        if (tip.trim() === '1X') {
          homeTeam !== '' &&
            parseInt(odds) < 2 &&
            date.includes(`${day1}/${month1}`) &&
            winData.push({
              source: 'wininbets_win',
              action: 'xwin',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction:
                tip.trim() === '1X' ? awayTeam.trim() : homeTeam.trim(),
            });
        }
        if (tip.trim() === 'X2') {
          homeTeam !== '' &&
            parseInt(odds) < 2 &&
            date.includes(`${day1}/${month1}`) &&
            winData.push({
              source: 'wininbets_win',
              action: 'xwin',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction:
                tip.trim() === 'X2' ? awayTeam.trim() : homeTeam.trim(),
            });
        }
      });

      // res.send('hello over loaded');
    })
    .catch((err) => console.log(err));

  //PREDUTD
  await axios(url_predutd)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      const body = $('#mainRow', html)
        .find('div:nth-child(2)')
        .find('div:nth-child(1)');

      $('div', body).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('thead:nth-child(1)')
          .find('th')
          .text()
          .split(' - ')[0];
        let awayTeam = $(this)
          .find('thead:nth-child(1)')
          .find('th')
          .text()
          .split(' - ')[1];
        let part = $(this)
          .find('thead:nth-child(1)')
          .find('th')
          .find('.text-muted')
          .text();
        awayTeam = awayTeam.replace(`${part}`, '');
        //  console.log('homeTeam222', homeTeam);

        let pred = $(this).find('thead').find('th').text();
        let action = '';
        let prediction = '';

        if (pred.includes('Team 1 @')) {
          action = 'win';
          prediction = homeTeam.trim();
        } else if (pred.includes('Team 2 @')) {
          action = 'win';
          prediction = awayTeam.trim();
        } else if (pred.includes('Team 1 Win Or Draw @')) {
          action = 'xwin';
          prediction = homeTeam.trim();
        } else if (pred.includes('Team 2 Win Or Draw @')) {
          action = 'xwin';
          prediction = awayTeam.trim();
        }

        homeTeam !== '' &&
          pred !== '' &&
          winData.push({
            source: 'predutd_win',
            action: action,
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction: prediction,
          });
      });

      // res.send('banker over loaded');
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
  //       const homeTeam = $(this).find('td:nth-child(2)').text();
  //       const awayTeam = $(this).find('td:nth-child(3)').text();
  //       const tip = $(this).find('td:nth-child(5)').text();

  //       homeTeam !== '' &&
  //         tip !== '' &&
  //         winData.push({
  //           source: 'vitibet_win',
  //           action: 'win',
  //           checked: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //           prediction: tip === '1' ? homeTeam.trim() : awayTeam.trim(),
  //         });
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));

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
  //           action: tip.includes('1X') ? 'xwin' : 'Win',
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
  //           action: tip.includes('2X') ? 'xwin' : 'Win',
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

  //fbp365
  await axios(url_fbp365)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('div[data-testid="statsTip"]', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        //  const homeTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(1)').text();
        //  const awayTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(2)').text();
        //  const tip = $(this).find('div:nth-child(3)').find('div:nth-child(1)').text();

        const homeTeam = $(this)
          .find('div:nth-child(2)')
          .find('div:nth-child(1)')
          .find('div:nth-child(1)')
          .find('div')
          .text();
        //  console.log('homeTeam000', homeTeam.trim());
        const awayTeam = $(this)
          .find('div:nth-child(2)')
          .find('div:nth-child(1)')
          .find('div:nth-child(2)')
          .find('div')
          .text();
        //  console.log('awayTeam000', awayTeam.trim());
        const tip = $(this)
          .find('div:nth-child(3)')
          .find('div:nth-child(1)')
          .text();
        //  console.log('tip000', tip);

        homeTeam !== '' &&
          winData.push({
            source: 'fbp365_win',
            action: 'win',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction: tip.includes(`${homeTeam.trim()}`)
              ? awayTeam.trim()
              : homeTeam.trim(),
          });
      });

      // res.send('r2bet over loaded');
    })
    .catch((err) => console.log(err));

  // MINES;
  await axios(url_mines1)
    .then((response) => {
      const data = response.data;

      data.forEach((elem) => {
        elem !== '' &&
          elem.bestOddProbability > 74 &&
          winData.push({
            source: 'mines_win',
            // action: `win ${elem.bestOdd} ${elem.bestOddProbability}%`,
            action: `win`,
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
        elem !== '' &&
          elem.bestOddProbability > 74 &&
          winData.push({
            source: 'mines_win',
            // action: `win ${elem.bestOdd} ${elem.bestOddProbability}%`,
            action: `win`,
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
            source: 'mybets_win',
            action: 'win',
            isAcca: true,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            date: todayString,
            prediction: prediction.includes('1') ? homeTeam : awayTeam,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // kingspredict
  await axios(url_kingspredict)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const body = $('.content', html);

      $('tr', body).each(function () {
        const homeTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:nth-child(1)')
          .text()
          .split('VS')[0];
        const awayTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:nth-child(1)')
          .text()
          .split('VS')[1];

        const tip = $(this)
          .find('td:nth-child(4)')
          .find('span:nth-child(1)')
          .text();

        //  console.log('homeTeam2222', homeTeam);
        //  console.log('awayTeam2222', awayTeam);
        //  console.log('tip2222', tip);

        if (tip.includes('1X') || tip.includes('X2')) {
          homeTeam !== '' &&
            winData.push({
              source: 'kingspredict_win',
              action: 'xwin',
              checked: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction: tip.includes('1X') ? homeTeam : awayTeam,
            });
        }
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
            source: 'footy_win',
            action: 'win',
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
            source: 'footy_win',
            action: 'win',
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
            source: 'venas_win',
            action: 'xwin',
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
            source: 'prot_win',
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
            source: 'r2bet_win',
            action: 'xwin',
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
            source: 'hello_win',
            action: 'xwin',
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
  //           predictionDate: `morph hits ${000.hits}`,
  //         });
  //       });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  // console.log('winData',winData)

  let filteredNoEmpty = winData.filter((elem) => elem.homeTeam !== '');
  let filteredNoEmpty2 = filteredNoEmpty.filter(
    (elem) => elem.prediction !== ''
  );

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  console.log('filteredNoEmpty2', filteredNoEmpty2);

  await WinData.insertMany(filteredNoEmpty2)
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
