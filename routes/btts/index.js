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
const { Draw } = require('../../mongo_schema/Draw');
const { Under25 } = require('../../mongo_schema/Under25');
const { WinData } = require('../../mongo_schema/WinDataModel');

const today = new Date();
const yesterday = new Date(today);
const tomorrow = new Date(today);

let draws = [];
let over25 = [];
let under25 = [];
let winData = [];

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

const ORIGIN = process.env.ORIGIN;

const bttsRouter = express.Router();

bttsRouter.use(cors());
const corsOptions = {
  origin: ORIGIN,
};

const url_fbp =
  'https://footballpredictions.net/btts-tips-both-teams-to-score-predictions';
// const url_fbp_o25 =
//   'https://footballpredictions.net/under-over-2-5-goals-betting-tips-predictions';
// const url_accum = 'https://footyaccumulators.com/football-tips/btts';
// const url_fst = 'https://www.freesupertips.com/both-teams-to-score-tips/';

const url_betwizad = `https://betwizad.com/predictions?date=${year}-${month1}-${day1}`;
const url_r2bet = 'https://r2bet.com/gg_btts';
const url_soccerpunt = `https://soccerpunt.com/`;
const url_wininbets = `https://wininbets.com/both-teams-to-score-tips`;
const url_fbp365 =
  'https://footballprediction365.com/both-teams-to-score-predictions';
const url_passion = `https://passionpredict.com/both-team-to-score?dt=${year}-${month}-${day}`;
const url_vitibet =
  'https://www.vitibet.com/index.php?clanek=quicktips&sekce=fotbal&lang=en';
const url_bigfree = 'https://bigfreetips.com/sure-bets-today/';
const url_kingspredict = 'https://kingspredict.com/btts';

const url_footsuper_btts =
  'https://www.footballsuper.tips/football-accumulators-tips/football-tips-both-teams-to-score-accumulator/';

//OTHER
const url_footy = 'https://footystats.org/predictions/btts';
const url_predutd =
  'https://predictionsunited.com/football-predictions-and-tips/today/both-teams-to-score';
const url_mighty = 'https://www.mightytips.com/football-predictions/btts/';
//   const url_wdw = 'https://www.windrawwin.com/accumulator-tips/today/';
const url_hello = 'https://hellopredict.com/btts';
const url_betimate = `https://betimate.com/en/football-predictions/both-to-score?date=2023-${month}-${day}`;
// const url_leaguelane = 'https://leaguelane.com/both-teams-to-score-tips/';
const url_betprotips =
  'https://betprotips.com/football-tips/both-teams-to-score-tips-btts/';
const url_kcpredict = 'https://kcpredict.com/both-team-to-score-tips';
const url_trustpredict = 'https://trustpredict.com/both-team-to-score';
//   const url_nvtips = 'https://nvtips.com/ru/';
const url_banker = 'https://bankerpredict.com/both-team-to-score';
const url_prot = 'https://www.protipster.com/betting-tips/btts';
const url_venasbet = 'https://venasbet.com/btts_gg';
const url_fbp2 = 'https://footballpredictions.com/footballpredictions/';
// const url_mybets =
//   'https://www.mybets.today/soccer-predictions/both-teams-to-score-predictions/';
// const url_fbpai =
//   'https://footballpredictions.ai/football-predictions/btts-predictions/';
const url_goalnow =
  'https://www.goalsnow.com/accumulator-btts-both-teams-to-score/';
const url_footsuper =
  'https://www.footballsuper.tips/todays-both-teams-to-score-football-super-tips/';

// const url_soccertipz = 'https://www.soccertipz.com/both-teams-to-score/';
const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-${month}-${day}T00:00:00Z&to=2023-0${month}-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.7&limit=20&minProbability=1&maxProbability=100&odds=GG&leagueIds=`;

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const btts = [];
const bttsVpn = [];
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

  await Btts.deleteMany({ date: req.query.date });
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

bttsRouter.get('/loadWithVpn', cors(corsOptions), async (req, res) => {
  console.log('bttsWithVpn111');

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

        // const prediction = $(this)
        //   .find('.accumulator-name')
        //   .find('strong')
        //   .text();

        const homeTeam = teams.includes('vs') && teams.split('vs')[0];
        const awayTeam = teams.includes('vs') && teams.split('vs')[1];

        homeTeam !== '' &&
          bttsVpn.push({
            source: 'fbp_acc_btts',
            action: 'btts',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: todayString,
            // predictionDate: predictionDate,
          });
      });

      //   res.send('fbp btts ok');
    })
    .catch((err) => console.log(err));

  // // FBP
  // await axios(url_fbp_o25)
  // .then((response) => {
  //   const html = response.data;
  //   // console.log(response.data);
  //   // console.log('000', response);
  //   const $ = cheerio.load(html);

  //   $('.accumulator-row', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();

  //     const teams = $(this).find('.accumulator-name').text();

  //     const prediction = $(this)
  //       .find('.accumulator-name')
  //       .find('strong')
  //       .text();

  //     const homeTeam = teams.includes('vs') && teams.split('vs')[0];
  //     let awayTeam = teams.includes('vs') && teams.split('vs')[1];
  //     awayTeam =
  //       awayTeam.includes(prediction) && awayTeam.replace(prediction, '');

  //     homeTeam !== '' &&
  //       prediction.includes('Over') &&
  //       under25Vpn.push({
  //         source: 'fbp_acc_o25',
  //         action: 'over25',
  //         isAcca: true,
  //         homeTeam:
  //           getHomeTeamName(homeTeam.trim()) !== ''
  //             ? getHomeTeamName(homeTeam.trim())
  //             : homeTeam.trim(),
  //         awayTeam: awayTeam.replace(prediction, ''),
  //         date: todayString,
  //       });
  //   });

  //   // res.send('fbp over loaded');
  // })
  // .catch((err) => console.log(err));

  let start = 0;
  let next = 1;
  let sortedBtts = bttsVpn.sort((a, b) => {
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
  // console.log('bttsFBP', sortedBtts);
  await Btts.insertMany(sortedBtts)
    .then(function () {
      console.log('Btts VPN inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('btts VPN loaded');
});

bttsRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('btts111');

  //betwizad
  await axios(url_betwizad)
  .then((response) => {
    const html = response.data;

    // console.log('000', html);
    const $ = cheerio.load(html);

    // const body = $('section:nth-child(2) tbody', html);

    $('.drow', html).each(function () {
      //<-- cannot be a function expression
      // const title = $(this).text();
      const homeTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[0];
      const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];

      const score = $(this).find('.col-7').find('.leftbar').find('div:nth-child(6)').text();
      const score1 = score.split('-')[0];
      const score2 = score.split('-')[1];
      
      
      const isDraw = score1 * 1 === score2 * 1;
      const homeScore = score1 > 0;
      const awayScore = score2 > 0;

      const bttsYes = homeScore && awayScore;
      const scoreTotal = score1 * 1 + score2 * 1;
      const win1 = score1 * 1 > score2 * 1;
      const win2 = score1 * 1 < score2 * 1;

      // console.log('homeTeam', homeTeam.trim());
      // console.log('awayTeam', awayTeam.trim());
      // console.log('cs', cs);
      
      homeTeam !== '' &&
          btts.push({
            source: 'betwizad_btts',
            action: bttsYes ? 'btts' : 'btts no',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
        homeTeam !== '' &&
          isDraw &&
          draws.push({
            source: 'betwizad_draw',
            action: 'draws',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
          if (scoreTotal >= 3) {
            homeTeam !== '' &&
            over25.push({
                source: 'betwizad_o25',
                action: 'over25',
                checked: false,
                homeTeam: homeTeam.trim(),
                awayTeam: awayTeam.trim(),
                date: todayString,
              });
          }
          if (scoreTotal <= 2) {
            homeTeam !== '' &&
            under25.push({
                source: 'betwizad_u25',
                action: 'under25',
                isAcca: false,
                homeTeam: homeTeam.trim(),
                awayTeam: awayTeam.trim(),
                date: todayString,
              });
          }
          if (win1 || win2) {
            homeTeam !== '' &&
            winData.push({
                source: 'betwizad_win',
                action: 'win',
                checked: false,
                homeTeam: homeTeam.trim(),
                awayTeam: awayTeam.trim(),
                date: todayString,
                prediction: win1 ? homeTeam.trim() : awayTeam.trim(),
              });
          }
   
    });

    // res.send('hello over loaded');
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

        if (tip.includes('BTTS Yes')) {
          homeTeam !== '' &&
            parseInt(odds) < 2 &&
            date.includes(`${day1}/${month1}`) &&
            btts.push({
              source: 'wininbets_btts',
              action: 'btts',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
      });

      // res.send('hello over loaded');
    })
    .catch((err) => console.log(err));

  await axios(url_betimate)
    .then((response) => {
      const html = response.data;
      // console.log(response.data);
      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.prediction-body', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.homeTeam').text();
        const awayTeam = $(this).find('.awayTeam').text();
        const date = $(this).find('time').text();

        // console.log('awayTeam111', awayTeam);
        // console.log('date111', date);

        // console.log('date222',date);
        // console.log('date333',`${month}/0${day}`);

        let probabilityOver = '';
        let probabilityUnder = '';

        const prediction = $(this).find('.predict').find('small').text();

        const bttsYes = prediction.includes('Yes');
        const bttsNo = prediction.includes('No');

        let day1 = '';
        if (parseInt(day) < 10) {
          day1 = `0${day}`;
        } else {
          day1 = day;
        }

        if (bttsYes) {
          probabilityOver = $(this)
            .find('.probability')
            .find('.highlight-predict')
            .text();

          homeTeam !== '' &&
            date.includes(`${month}/${day1}`) &&
            probabilityOver !== '' &&
            Number(probabilityOver) > 58 &&
            btts.push({
              source: 'betimate_btts',
              action: `btts`,
              checked: false,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim().replace('FC ', ''),
              awayTeam,
              date: todayString,
            });
        }

        if (bttsNo) {
          probabilityUnder = $(this)
            .find('.probability')
            .find('.highlight-predict')
            .text();

          homeTeam !== '' &&
            date.includes(`${month}/0${day}`) &&
            probabilityUnder !== '' &&
            Number(probabilityUnder) > 58 &&
            btts.push({
              source: 'betimate_btts',
              action: `btts no`,
              checked: false,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim().replace('FC ', ''),
              awayTeam,
              date: todayString,
            });
        }
        // console.log('probabilityOver', Number(probabilityOver));
        //   console.log('probabilityUnder', Number(probabilityUnder));
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

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
  //         btts.push({
  //           source: 'leaguelane_btts',
  //           action: 'btts',
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

  //betprotips
  await axios(url_betprotips)
    .then((response) => {
      const html = response.data;
      // console.log(response.data);
      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.prediction-card', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        // const homeTeam = $(this).find('.teams').find('.home-team').find('span:nth-child(1)').text();
        const homeTeam = $(this).find('.teams').find('.home-team').text();
        // console.log('homeTeam000', homeTeam);

        const awayTeam = $(this).find('.teams').find('.away-team').text();
        // console.log('awayTeam000', awayTeam);
        const prediction = $(this)
          .find('.advice-row')
          .find('div:nth-child(1)')
          .text();
        // console.log('prediction000', prediction);
        const bttsYes = prediction.includes(': Yes');
        // console.log('over25Fbp', underYes);

        homeTeam !== '' &&
          bttsYes &&
          btts.push({
            source: 'betprotips_btts',
            action: bttsYes ? 'btts' : 'btts no',
            isAcca: true,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim().replace('FC ', ''),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(over25);
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
          btts.push({
            source: 'kcpredict_btts',
            action: 'btts',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('hello over loaded');
    })
    .catch((err) => console.log(err));

  //trustpredict
  await axios(url_trustpredict)
    .then((response) => {
      const html = response.data;

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

        // console.log('2222', homeTeam);

        const awayTeam = $(this)
          .find('td:nth-child(3)')
          .find('span:first')
          .text()
          .split('VS')[1];

        // const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];
        // const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          btts.push({
            source: 'trustpredict_btts',
            action: 'btts',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('hello over loaded');
    })
    .catch((err) => console.log(err));

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
            source: 'footsuper_acc_btts',
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

  //FBP
  // await axios(url_fbp)
  // await axios(url_fbp)
  //   .then((response) => {
  //     const html = response.data;
  //     // console.log(response.data);
  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.card-body', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this).find('.home-team').find('.team-label').text();
  //       const awayTeam = $(this).find('.away-team').find('.team-label').text();
  //       //   const over25text = $(this).find('.prediction').text();
  //       //   const over25Yes = over25text.includes('Over');
  //       // console.log('over25Fbp', over25);
  //       const predictionDate = $(this)
  //         .find('.match-preview-date')
  //         .find('.full-cloak')
  //         .text();

  //       homeTeam !== '' &&
  //         predictionDate.includes(`${year}-${month}-${day}`) &&
  //         btts.push({
  //           source: 'fbp_btts',
  //           action: 'btts',
  //           checked: false,
  //           homeTeam,
  //           awayTeam,
  //           date: todayString,
  //         });
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
        let bttsYes = false;
        if (homeTeam.includes('BTTS Yes')) {
          bttsYes = true;
          homeTeam1 = homeTeam.split('BTTS Yes ')[1];
        }
        if (homeTeam.includes('BTTS No')) {
          bttsYes = false;
          homeTeam1 = homeTeam.split('BTTS No ')[1];
        }
        const awayTeam = $(this)
          .find('.betHeaderTitle')
          .text()
          .split(' vs ')[1];
        homeTeam1 !== '' &&
          btts.push({
            source: 'footy_btts',
            action: bttsYes ? 'btts' : 'btts no',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam1.trim()) !== ''
                ? getHomeTeamName(homeTeam1.trim())
                : homeTeam1.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

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
  //       const bttsText = $(this).find('.tipdiv').find('span:first').text();
  //       const bttsYes = bttsText === 'Yes';
  //       // console.log('over25Mybets', over25);

  //       // if (homeTeam.trim() === 'Accrington ST') {
  //       //   console.log('over25 HT', getHomeTeamName(homeTeam.trim()))
  //       // };

  //       homeTeam !== '' &&
  //         btts.push({
  //           source: 'mybets_btts',
  //           action: bttsYes ? 'btts' : 'btts no',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim(),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //PASSION
  await axios(url_passion)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);
      // let homeTeamsArr = [];
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

        homeTeam !== '' &&
          homeTeam !== 'BTTS/GG' &&
          btts.push({
            source: 'passion_btts',
            action: 'btts',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: todayString,
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
        // const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          btts.push({
            source: 'r2bet_btts',
            action: 'btts',
            isAcca: false,
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
  // await axios(url_fst)
  //   .then((response) => {
  //     const html = response.data;
  //     // const over25 = [];
  //     const $ = cheerio.load(html);

  //     $('.Leg__title', html).each(function () {
  //       let homeTeam = '';
  //       let awayTeam = '';

  //       homeTeam = $(this).find('.Leg__lose').text().split('vs')[0];
  //       awayTeam = $(this).find('.Leg__lose').text().split('vs')[1];

  //       homeTeam !== '' &&
  //         btts.push({
  //           source: 'fst_btts',
  //           action: 'btts',
  //           isAcca: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     //   res.send('fst btts ok');
  //   })
  //   .catch((err) => console.log(err));

  // //PROT
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
  //         btts.push({
  //           source: 'prot_btts',
  //           action: 'btts',
  //           isAcca: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //         });
  //     });

  //     //   res.send('prot btts ok');
  //   })
  //   .catch((err) => console.log(err));

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
        const pred = $(this).find('.details-pick__match-data__outcome').text();
        const homeTeam = teams.split(' VS ')[0];
        const awayTeam = teams.split(' VS ')[1];

        homeTeam !== '' &&
          pred.includes('Both teams will score') &&
          btts.push({
            source: 'prot_btts',
            action: 'btts',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('prot over loaded');
    })
    .catch((err) => console.log(err));

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
          btts.push({
            source: 'banker_btts',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      //   res.send('banker btts ok');
    })
    .catch((err) => console.log(err));

  //WDW
  //   await axios(url_wdw)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('td:nth-child(2)')
  //         .find('a:first')
  //         .text()
  //         .split(' v ')[0];
  //       const awayTeam = $(this)
  //         .find('td:nth-child(2)')
  //         .find('a:first')
  //         .text()
  //         .split(' v ')[1];
  //       const bet = $(this)
  //         .find('td:nth-child(3)')
  //         .text();

  //       homeTeam !== '' && bet.includes('BTTS Yes') &&
  //         btts.push({
  //           source: 'wdw',
  //           action: 'btts',
  //           checked: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //         });
  //     });

  //   //   res.send('banker btts ok');
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
          btts.push({
            source: 'venas_btts',
            action: 'btts',
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

  

  // //bigfree
  await axios(url_bigfree)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.card', html).each(function () {
        const homeTeam = $(this)
          .find('.card-header')
          .find('div:nth-child(1)')
          .text()
          .split(' vs ')[0];
        const awayTeam = $(this)
          .find('.card-header')
          .find('div:nth-child(1)')
          .text()
          .split(' vs ')[1];

        const tip = $(this).find('.card-title').text();

        if (tip.includes('Over 2.5')) {
          homeTeam !== '' &&
            over25.push({
              source: 'bigfree_o25',
              action: 'over25',
              checked: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (tip.includes('Both Team to Score')) {
          homeTeam !== '' &&
            btts.push({
              source: 'bigfree_btts',
              action: 'btts',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (tip.includes('Under 2.5')) {
          homeTeam !== '' &&
            under25.push({
              source: 'bigfree_u25',
              action: 'under25',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (tip.includes(`${homeTeam}`) || tip.includes(`${awayTeam}`)) {
          homeTeam !== '' &&
            winData.push({
              source: 'bigfree_win',
              action: 'win',
              checked: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction: tip.includes(`${homeTeam}`)
                ? homeTeam.trim()
                : awayTeam.trim(),
            });
        }
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  //fbp365
  await axios(url_fbp365)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('div[data-testid="statsTip"]', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        // const homeTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(1)').text();
        // const awayTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(2)').text();
        // const tip = $(this).find('div:nth-child(3)').find('div:nth-child(1)').text();

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
          tip.includes('Yes') &&
          btts.push({
            source: 'fbp365_btts',
            action: 'btts',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('r2bet over loaded');
    })
    .catch((err) => console.log(err));

  //soccerpunt
  await axios(url_soccerpunt)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.tipseri-pariuri', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('.event')
          .find('.teams')
          .text()
          .split(' – ')[0];
        const awayTeam = $(this)
          .find('.event')
          .find('.teams')
          .text()
          .split(' – ')[1];

        const tip = $(this).find('div:nth-child(3)').text();

        // console.log('222', homeTeam);
        // console.log('333', awayTeam);
        // console.log('444', tip);

        if (tip.includes('WIN')) {
          homeTeam !== '' &&
            winData.push({
              source: 'soccerpunt_win',
              action: 'win',
              isAcca: true,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction: tip.includes(homeTeam.trim()) ? homeTeam : awayTeam,
            });
        }
        if (tip.includes('1X') || tip.includes('X2')) {
          homeTeam !== '' &&
            winData.push({
              source: 'soccerpunt_win',
              action: 'xwin',
              isAcca: true,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction: tip.includes('1X') ? homeTeam : awayTeam,
            });
        }
        if (tip.includes('OVER 2.5 GOALS')) {
          homeTeam !== '' &&
            over25.push({
              source: 'soccerpunt_o25',
              action: 'over25',
              isAcca: true,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (tip.includes('BTS / YES')) {
          homeTeam !== '' &&
            btts.push({
              source: 'soccerpunt_btts',
              action: 'btts',
              isAcca: true,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (tip.includes('X')) {
          homeTeam !== '' &&
            draws.push({
              source: 'soccerpunt_draw',
              action: 'draws',
              isAcca: true,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (tip.includes('UNDER 2.5 GOALS')) {
          homeTeam !== '' &&
            under25.push({
              source: 'soccerpunt_u25',
              action: 'under25',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
      });

      // res.send('hello over loaded');
    })
    .catch((err) => console.log(err));

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

        homeTeam !== '' &&
          btts.push({
            source: 'fbp2_btts',
            action: bttsYes ? 'btts' : 'btts no',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
        homeTeam !== '' &&
          isDraw &&
          draws.push({
            source: 'fbp2_draw',
            action: 'draws',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
          if (scoreTotal >= 3) {
            homeTeam !== '' &&
            over25.push({
                source: 'fbp2_o25',
                action: 'over25',
                checked: false,
                homeTeam: homeTeam.trim(),
                awayTeam: awayTeam.trim(),
                date: todayString,
              });
          }
          if (scoreTotal <= 2) {
            homeTeam !== '' &&
            under25.push({
                source: 'fbp2_u25',
                action: 'under25',
                isAcca: false,
                homeTeam: homeTeam.trim(),
                awayTeam: awayTeam.trim(),
                date: todayString,
              });
          }
          if (win1 || win2) {
            homeTeam !== '' &&
            winData.push({
                source: 'fbp2_win',
                action: 'win',
                checked: false,
                homeTeam: homeTeam.trim(),
                awayTeam: awayTeam.trim(),
                date: todayString,
                prediction: win1 ? homeTeam.trim() : awayTeam.trim(),
              });
          }
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //VITIBET
  await axios(url_vitibet)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('tr', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const date = $(this).find('td:nth-child(1)').text();
        const homeTeam = $(this).find('td:nth-child(3)').text();
        const awayTeam = $(this).find('td:nth-child(4)').text();
        const score1 = $(this).find('td:nth-child(6)').text();
        const score2 = $(this).find('td:nth-child(8)').text();
        const tip = $(this).find('td:nth-child(12)').text();

        const homeScore = score1 > 0;
        const awayScore = score2 > 0;

        const bttsYes = homeScore && awayScore;
        const scoreTotal = score1 * 1 + score2 * 1;
        const isDraw = score1 * 1 === score2 * 1;
        console.log('bttsYes', bttsYes);
        console.log('homeTeam', homeTeam);
        console.log('tip222', tip);

        if (isDraw) {
          homeTeam !== '' &&
            date.includes(`${day}.${month}`) &&
            draws.push({
              source: 'vitibet_draw',
              action: 'draws',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (scoreTotal >= 3) {
          homeTeam !== '' &&
            date.includes(`${day}.${month}`) &&
            over25.push({
              source: 'vitibet_o25',
              action: 'over25',
              checked: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (scoreTotal <= 1) {
          homeTeam !== '' &&
            date.includes(`${day}.${month}`) &&
            under25.push({
              source: 'vitibet_u25',
              action: 'under25',
              isAcca: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
            });
        }
        if (tip === '1' || tip === '2') {
          homeTeam !== '' &&
            date.includes(`${day}.${month}`) &&
            winData.push({
              source: 'vitibet_win',
              action: 'win',
              checked: false,
              homeTeam: homeTeam.trim(),
              awayTeam: awayTeam.trim(),
              date: todayString,
              prediction: tip === '1' ? homeTeam.trim() : awayTeam.trim(),
            });
        }

        homeTeam !== '' &&
          date.includes(`${day}.${month}`) &&
          btts.push({
            source: 'vitibet_btts',
            action: bttsYes ? 'btts' : 'btts no',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  //Goalnow
  await axios(url_goalnow)
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
        console.log('awayTeam', awayTeam);
        // let homeTeam1 = '';
        // if (homeTeam.includes('2.5 Goals')) {
        //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
        // }
        // const awayTeam = $(this)
        //   .find('.goalsaway')
        //   .text();
        const pred = $(this).find('.row4').find('span:first').text();
        homeTeam !== '' &&
          pred.includes('Yes') &&
          btts.push({
            source: 'goalsnow_btts',
            action: 'btts',
            isAcca: true,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam: awayTeam,
            date: todayString,
          });
      });

      // res.json(over25);
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

  //       const isPred = $(this).find('.match-tip-show').text();

  //       if (isPred === 'Yes') {
  //         const homeTeam = $(this)
  //           .find('.match-teams')
  //           .find('div:first')
  //           .text();
  //         const awayTeam = $(this)
  //           .find('.match-teams')
  //           .find('div:nth-child(2)')
  //           .text();
  //         homeTeam !== '' &&
  //           awayTeam !== '' &&
  //           btts.push({
  //             source: 'fbpai_btts',
  //             action: 'btts',
  //             checked: false,
  //             homeTeam:
  //               getHomeTeamName(homeTeam.trim()) !== ''
  //                 ? getHomeTeamName(homeTeam.trim())
  //                 : homeTeam.trim(),
  //             awayTeam:
  //               getHomeTeamName(awayTeam.trim()) !== ''
  //                 ? getHomeTeamName(awayTeam.trim())
  //                 : awayTeam.trim(),
  //             date: todayString,
  //           });
  //       }
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

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

        if (homeTeam.trim() === 'Accrington ST') {
          console.log('btts HT', getHomeTeamName(homeTeam.trim()));
        }

        todayString.includes(predicDate) &&
          homeTeam !== '' &&
          btts.push({
            source: 'mighty_btts',
            action: 'btts',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  //Mines
  // await axios(url_mines)
  //   .then((response) => {
  //     const data = response.data;

  //     data.forEach((elem) => {
  //       elem !== '' &&
  //         elem.bestOddProbability > 79 &&
  //         btts.push({
  //           source: 'mines_btts',
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

  //NVTIPS
  //   await axios(
  //     url_nvtips
  //   )
  //     .then((response) => {
  //       const html = response.data;

  //       // console.log('000', html);
  //       const $ = cheerio.load(html);
  //       let homeTeamsArr = [];

  //       $('tr', html).each(function () {
  //         //<-- cannot be a function expression
  //         // const title = $(this).text();
  //         const homeTeam = $(this)
  //           .find('td:nth-child(6)')
  //           .text();
  //         const bttsYes = $(this)
  //           .find('td:nth-child(14)')
  //           .find('strong:first')
  //           .text();

  //         // const awayTeam = $(this).find('tr').find('td:nth-child(3)').find('span:first').text().split(' "" ')[1].split(' VS')[1];
  //         // const awayTeam = $(this).find('.mtl-index-page-matches__name').text().split(' vs ')[1];
  //         // const predicDate = $(this).find('.mtl-index-page-matches__date').find('p:first').find('time:first').text();
  //         // console.log('homeTeamPass', homeTeam);
  //         if (bttsYes === 'Да') {
  //           homeTeamsArr.push(homeTeam);
  //         }
  //       });
  //       // console.log('homeTeamsArr', homeTeamsArr);
  //       homeTeamsArr.splice(0, 1);
  //       console.log('homeTeamsArr111', homeTeamsArr);
  //       let indexOfEmpty = homeTeamsArr.indexOf('');
  //       // console.log('indexOfEmpty', indexOfEmpty);
  //       let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
  //       // console.log('todayHomeTeamsArr', todayHomeTeamsArr);
  //       todayHomeTeamsArr.forEach((elem) => {
  //         elem !== '' &&
  //           btts.push({
  //             source: 'nvtips',
  //             action: 'btts',
  //             checked: false,
  //             homeTeam:
  //               getHomeTeamName(elem) !== '' ? getHomeTeamName(elem) : elem,
  //             awayTeam: '',
  //             date: todayString,
  //           });
  //       });

  //       // res.json(btts);
  //     })
  //     .catch((err) => console.log(err));

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
        const bttsYes = pred.includes('YES');
        const percent = $(this).find('.biggestpercen').text();

        homeTeam !== '' &&
          parseInt(percent) > 74 &&
          btts.push({
            source: 'footsuper_btts',
            action: bttsYes ? `btts` : `btts no`,
            isAcca: false,
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
        // const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          btts.push({
            source: 'hello_btts',
            action: 'btts',
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

        homeTeam !== '' &&
          btts.push({
            source: 'predutd_btts',
            action:
              (pred.includes('BTTS @') && 'btts') ||
              (pred.includes('BTTS - No') && 'btts no'),
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.send('banker over loaded');
    })
    .catch((err) => console.log(err));

  // kingspredict
  await axios(url_kingspredict)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const body = $('.content', html);

      // console.log('body2222', body);

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

        // console.log('homeTeam2222', homeTeam);
        // console.log('awayTeam2222', awayTeam);

        homeTeam !== '' &&
          !homeTeam.includes('BTTS') &&
          !homeTeam.includes('TIPS') &&
          btts.push({
            source: 'kingspredict_btts',
            action: 'btts',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

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

  //       homeTeam &&
  //         homeTeam !== '' &&
  //         awayTeam &&
  //         awayTeam !== '' &&
  //         tip.includes('YES') &&
  //         btts.push({
  //           source: 'soccertipz_btts',
  //           action: 'btts',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim(),
  //           awayTeam:
  //             getHomeTeamName(awayTeam.trim()) !== ''
  //               ? getHomeTeamName(awayTeam.trim())
  //               : awayTeam.trim(),
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

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

  let start1 = 0;
  let next1 = 1;
  let sortedDraws = draws.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next1 < sortedDraws.length) {
    if (
      sortedDraws[start1].homeTeam.trim() === sortedDraws[next1].homeTeam.trim()
    ) {
      if (
        sortedDraws[start1].action === sortedDraws[next1].action &&
        sortedDraws[start1].source === sortedDraws[next1].source
      ) {
        sortedDraws.splice(next1, 1);
      }
    }

    start1++;
    next1++;
  }
  let start2 = 0;
  let next2 = 1;
  let sortedOver25 = over25.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next2 < sortedOver25.length) {
    if (
      sortedOver25[start2].homeTeam.trim() ===
      sortedOver25[next2].homeTeam.trim()
    ) {
      if (
        sortedOver25[start2].action === sortedOver25[next2].action &&
        sortedOver25[start2].source === sortedOver25[next2].source
      ) {
        sortedOver25.splice(next2, 1);
      }
    }

    start2++;
    next2++;
  }
  let start3 = 0;
  let next3 = 1;
  let sortedUnder25 = under25.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next3 < sortedUnder25.length) {
    if (
      sortedUnder25[start3].homeTeam.trim() ===
      sortedUnder25[next3].homeTeam.trim()
    ) {
      if (
        sortedUnder25[start3].action === sortedUnder25[next3].action &&
        sortedUnder25[start3].source === sortedUnder25[next3].source
      ) {
        sortedUnder25.splice(next3, 1);
      }
    }

    start3++;
    next3++;
  }
  let start4 = 0;
  let next4 = 1;
  let sortedWinData = winData.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next4 < sortedWinData.length) {
    if (
      sortedWinData[start4].homeTeam.trim() ===
      sortedWinData[next4].homeTeam.trim()
    ) {
      if (
        sortedWinData[start4].action === sortedWinData[next4].action &&
        sortedWinData[start4].source === sortedWinData[next4].source
      ) {
        sortedWinData.splice(next4, 1);
      }
    }

    start4++;
    next4++;
  }

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  sortedBtts = sortedBtts.filter(elem => {return elem.homeTeam !== ''});
  console.log('sortedBtts', sortedBtts);
  await Btts.insertMany(sortedBtts)
    .then(function () {
      console.log('Btts inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await Draw.insertMany(sortedDraws)
    .then(function () {
      console.log('Draws inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await Under25.insertMany(sortedUnder25)
    .then(function () {
      console.log('Under inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await Over.insertMany(sortedOver25)
    .then(function () {
      console.log('Over inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await WinData.insertMany(sortedWinData)
    .then(function () {
      console.log('WinData inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('btts loaded');
});

// bttsRouter.get('/loadOther', cors(corsOptions), async (req, res) => {
//   console.log('btts111');

//   let start = 0;
//   let next = 1;
//   let sortedBtts = btts.sort((a, b) => {
//     if (a.homeTeam < b.homeTeam) {
//       return -1;
//     }
//     if (a.homeTeam > b.homeTeam) {
//       return 1;
//     }
//     return 0;
//   });

//   //удаление дублей
//   while (next < sortedBtts.length) {
//     if (
//       sortedBtts[start].homeTeam.trim() === sortedBtts[next].homeTeam.trim()
//     ) {
//       if (
//         sortedBtts[start].action === sortedBtts[next].action &&
//         sortedBtts[start].source === sortedBtts[next].source
//       ) {
//         sortedBtts.splice(next, 1);
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

//   await Btts.insertMany(sortedBtts)
//     .then(function () {
//       console.log('Btts inserted'); // Success
//     })
//     .catch(function (error) {
//       console.log(error); // Failure
//     });

//   await db.disconnect();
//   res.send('btts loaded');
// });
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = bttsRouter;
