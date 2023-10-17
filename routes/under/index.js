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
const { Under25 } = require('../../mongo_schema/Under25');

const ORIGIN = process.env.ORIGIN;

const underRouter = express.Router();

underRouter.use(cors());
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
const yesterdayString = formattedYesterday.toString();
const todayString = formattedToday.toString();
const year = today.getFullYear();
const day = today.getDate();
const dayTom = tomorrow.getDate();
let month = today.getMonth();
month = month < 10 ? `${month + 1}` : month + 1;

const url_goalnow = 'https://www.goalsnow.com/over-under-predictions/';
const url_passion = `https://passionpredict.com/over-2-5-goals?dt=${year}-${month}-${day}`;
const url_predutd = 'https://predictionsunited.com/football-predictions-and-tips/today/under-2-5-goals';
const url_vitibet =
  'https://www.vitibet.com/index.php?clanek=quicktips&sekce=fotbal&lang=en';
const url_venasbet = 'https://venasbet.com/under_3_5_goals';
const url_nvtips = 'https://nvtips.com/ru/';
const url_soccertipz = 'https://www.soccertipz.com/under-over-2-5-predictions/';
const url_r2bet = 'https://r2bet.com/under_3_5_goals';
const url_betprotips = 'https://betprotips.com/football-tips/over-under-tips/';
const url_betimate = `https://betimate.com/en/football-predictions/under-over-25-goals?date=2023-${month}-${day}`;
// const url_gnow_accum = 'https://www.goalsnow.com/accumulator-over-2.5-goals/';
const url_fbp =
  'https://footballpredictions.net/under-over-2-5-goals-betting-tips-predictions';
// const url_accum =
//   'https://footyaccumulators.com/football-tips/over-2-5-trebles';
// const url_fst = 'https://www.freesupertips.com/free-football-betting-tips/';
// const url_footy = 'https://footystats.org/predictions/over-25-goals';
// const url_o25tips = 'https://www.over25tips.com/';
// const url_zakabet = 'https://zakabet.com/over-2-5-goals/';
const url_mybets =
  'https://www.mybets.today/soccer-predictions/under-over-2-5-goals-predictions/';
const url_fbpai =
  'https://footballpredictions.ai/football-predictions/over-under-predictions/';
const url_footsuper =
  'https://www.footballsuper.tips/todays-over-under-football-super-tips/';
const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-${month}-${day}T00:00:00Z&to=2023-${month}-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.8&limit=20&minProbability=1&maxProbability=100&odds=UNDER_25&leagueIds=`;

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const under25 = [];
const under25Vpn = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
underRouter.get('/delete', cors(corsOptions), async (req, res) => {
  // const today = new Date();
  // const formattedToday = fns.format(today, 'dd.MM.yyyy');
  // const todayString = formattedToday.toString();

  console.log('req.query.date',req.query.date);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await Under25.deleteMany({ date: req.query.date });
  console.log('Under deleted'); // Success
  res.send('under deleted');
  await db.disconnect();
});

underRouter.get('/get', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const under25Arr = await Under25.find({ date: req.query.date });
  await db.disconnect();

  res.json(under25Arr);
});

underRouter.post('/save', async (req, res) => {
  let data = req.body;
  console.log('dataPred', data);
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
      let newUnder = await new Under25(newBttsObj);
      await newUnder.save(function (err) {
        if (err) return console.error(err);
        console.log('new Under saved succussfully!');
      });

      await db.disconnect();
    });
    console.log('new preds saved succussfully!');
  }

  res.json('new preds inserted');
});

underRouter.get('/loadWithVpn', cors(corsOptions), async (req, res) => {
  console.log('underWithVpn111');

  // // FBP
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
          prediction.includes('Under') &&
          under25Vpn.push({
            source: 'fbp_acc_u25',
            action: 'under25',
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

   //FBP
   await axios(url_fbp)
    .then((response) => {
      const html = response.data;
      // console.log(response.data);
      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.card-body', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.home-team').find('.team-label').text();
        const awayTeam = $(this).find('.away-team').find('.team-label').text();
        const under25text = $(this).find('.prediction').text();
        const under25Yes = under25text.includes('Under');
        // console.log('over25Fbp', over25);
        const predictionDate = $(this)
          .find('.match-preview-date')
          .find('.full-cloak')
          .text();
        homeTeam !== '' &&
          under25Yes &&
          under25Vpn.push({
            source: 'fbp_u25',
            action: 'under25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim().replace('FC ', ''),
            awayTeam,
            date: todayString,
            predictionDate: predictionDate,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  let start = 0;
  let next = 1;
  let sortedUnder25 = under25Vpn.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next < sortedUnder25.length) {
    if (
      sortedUnder25[start].homeTeam.trim() === sortedUnder25[next].homeTeam.trim()
    ) {
      if (
        sortedUnder25[start].action === sortedUnder25[next].action &&
        sortedUnder25[start].source === sortedUnder25[next].source
      ) {
        sortedUnder25.splice(next, 1);
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
  await Under25.insertMany(sortedUnder25)
    .then(function () {
      console.log('under VPN inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('under VPN loaded');
});

underRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('under111');

  // FBP
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
  //         prediction.includes('Under') &&
  //         under25.push({
  //           source: 'fbp_acc_u25',
  //           action: 'under25',
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

  //  //FBP
  //  await axios(url_fbp)
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
  //       const under25text = $(this).find('.prediction').text();
  //       const under25Yes = under25text.includes('Under');
  //       // console.log('over25Fbp', over25);
  //       const predictionDate = $(this)
  //         .find('.match-preview-date')
  //         .find('.full-cloak')
  //         .text();
  //       homeTeam !== '' &&
  //         under25Yes &&
  //         under25.push({
  //           source: 'fbp_u25',
  //           action: 'under25',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim().replace('FC ', ''),
  //           awayTeam,
  //           date: todayString,
  //           predictionDate: predictionDate,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //VENAS
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
          under25.push({
            source: 'venas_u25',
            action: 'under25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim().replace('FC ', ''),
            awayTeam:
              getHomeTeamName(awayTeam.trim()) !== ''
                ? getHomeTeamName(awayTeam.trim())
                : awayTeam.trim().replace('FC ', ''),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

     // betprotips
  // await axios(url_fbp)
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
      const prediction = $(this).find('.advice-row').find('div:nth-child(1)').text();
      // console.log('prediction000', prediction);
      const underYes = prediction.includes('Under 2.5');
      // console.log('over25Fbp', underYes);

      homeTeam !== '' &&
      underYes &&
        under25.push({
          source: 'betprotips_u25',
          action: 'under25',
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
  
        let probabilityUnder = '';
  
        const prediction = $(this).find('.predict').find('small').text();
       //  console.log('prediction000', prediction);
  
        const underYes = prediction.includes('Under');
  
        if (underYes) {
          probabilityUnder = $(this).find('.probability').find('div:nth-child(1)').text();
        }
       //  console.log('over25Fbp', probabilityUnder);
  
        homeTeam !== '' && date.includes(`${month}/0${day}`) &&
        underYes &&
          under25.push({
            source: 'betimate_u25',
            action: `under25 ${probabilityUnder}`,
            checked: false,
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

    //PREDUTD
    await axios(url_predutd)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      const body = $('#mainRow', html).find('div:nth-child(2)').find('div:nth-child(1)');

      $('div', body).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this)
          .find('th')
          .text()
          .split(' - ')[0];


          let awayTeam = $(this).find('thead:nth-child(1)').find('th').text().split(' - ')[1];
     let part = $(this).find('thead:nth-child(1)').find('th').find('.text-muted').text();
      awayTeam = awayTeam.replace(`${part}`, '');

          // console.log('predutdU25', homeTeam);

        homeTeam !== '' &&
        under25.push({
            source: 'predutd_u25',
            action: 'under25',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
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
  //       const date = $(this).find('td:nth-child(1)').text();
  //       const homeTeam = $(this).find('td:nth-child(2)').text();
  //       const awayTeam = $(this).find('td:nth-child(3)').text();
  //       const score1 = $(this).find('td:nth-child(4)').text();
  //       const score2 = $(this).find('td:nth-child(6)').text();

  //       const scoreTotal = score1 * 1 + score2 * 1;

  //       homeTeam !== '' &&
  //         date.includes(`${day}.${month}`) &&
  //         scoreTotal <= 1 &&
  //         under25.push({
  //           source: 'vitibet_u25',
  //           action: 'under25',
  //           isAcca: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //         });
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));

  //NVTIPS
  // await axios(url_nvtips)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);
  //     let homeTeamsArr = [];

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this).find('td:nth-child(6)').text();
  //       const underYes = $(this)
  //         .find('td:nth-child(13)')
  //         .find('strong:first')
  //         .text();

  //       if (underYes.includes('Менее')) {
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
  //         under25.push({
  //           source: 'nvtips',
  //           action: 'under25',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(elem) !== ''
  //               ? getHomeTeamName(elem)
  //               : elem.replace('FC ', ''),
  //           awayTeam: '',
  //           date: todayString,
  //         });
  //     });

  //     // res.json(btts);
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
          tip.includes('Under') &&
          under25.push({
            source: 'soccertipz_u25',
            action: 'under25',
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
  await axios(url_mines)
    .then((response) => {
      const data = response.data;
      // console.log('minesUnder', data);

      data.forEach((elem) => {
        elem !== '' && elem.bestOddProbability > 74 &&
          under25.push({
            source: 'mines_u25',
            action: `under25 ${elem.bestOddProbability}%`,
            homeTeam: elem.localTeam.name,
            awayTeam: elem.visitorTeam.name,
            date: todayString,
            isAcca: false,
          });
      });

      // res.json(btts);
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
          pred.includes('UNDER') &&
          parseInt(percent) > 68 &&
          under25.push({
            source: 'footsuper_u25',
            action: 'under25',
            isAcca: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim().replace('FC ', ''),
            awayTeam:
              getHomeTeamName(awayTeam.trim()) !== ''
                ? getHomeTeamName(awayTeam.trim())
                : awayTeam.trim().replace('FC ', ''),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //PASSION
  await axios(
    url_passion
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

        let pred = $(this).find('td:nth-child(4)').find('span:first').text();

        homeTeam !== '' &&
          pred !== '' &&
          pred.includes('Under') &&
          homeTeamsArr.push({ homeTeam: homeTeam, pred: pred });
      });

      homeTeamsArr.forEach((elem) => {
        elem.homeTeam !== '' &&
          elem.pred !== '' &&
          elem.pred.includes('Under') &&
          under25.push({
            source: 'passion_u25',
            action: 'under25',
            checked: false,
            homeTeam:
              getHomeTeamName(elem.homeTeam.trim()) !== ''
                ? getHomeTeamName(elem.homeTeam.trim())
                : elem.homeTeam.trim().replace('FC ', ''),
            awayTeam: '',
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //venasbet
  // await axios(url_venasbet)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this).find('td:nth-child(3)').text().split('VS')[0];

  //       const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];

  //       homeTeam !== '' &&
  //         under25.push({
  //           source: 'venas',
  //           action: 'under35',
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
          under25.push({
            source: 'r2bet_u25',
            action: 'under35',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim().replace('FC ', ''),
            awayTeam:
              getHomeTeamName(awayTeam.trim()) !== ''
                ? getHomeTeamName(awayTeam.trim())
                : awayTeam.trim().replace('FC ', ''),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //Footy
  // await axios(url_footy)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.betHeader', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('.betHeaderTitle')
  //         .text()
  //         .split(' vs ')[0];
  //       let homeTeam1 = '';
  //       if (homeTeam.includes('2.5 Goals')) {
  //         homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
  //       }
  //       const awayTeam = $(this)
  //         .find('.betHeaderTitle')
  //         .text()
  //         .split(' vs ')[1];
  //       homeTeam1 !== '' &&
  //         over25.push({
  //           source: 'footy',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam: getHomeTeamName(homeTeam1.trim()) !=='' ? getHomeTeamName(homeTeam1.trim()) : homeTeam1.trim(),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  // //O25TIPS
  // await axios(url_o25tips)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.predictionsTable', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('[itemprop=homeTeam]')
  //         .find('span:first')
  //         .text();
  //       // let homeTeam1 = '';
  //       // if (homeTeam.includes('2.5 Goals')) {
  //       //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
  //       // }
  //       const awayTeam = $(this)
  //       .find('[itemprop=awayTeam]')
  //       .find('span:first')
  //       .text();
  //       let probability = $(this)
  //       .find('[itemprop=description]')
  //       .find('span:first')
  //       .text();

  //       probability = probability.split('%')[0];

  //       homeTeam !== '' && Number(probability) > 69 &&
  //         over25.push({
  //           source: 'footy',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));
  // //ZAKABET
  // await axios(url_zakabet)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.entry-content', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('[itemprop=homeTeam]')
  //         .find('span:first')
  //         .text();
  //       // let homeTeam1 = '';
  //       // if (homeTeam.includes('2.5 Goals')) {
  //       //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
  //       // }
  //       const awayTeam = $(this)
  //       .find('[itemprop=awayTeam]')
  //       .find('span:first')
  //       .text();
  //       let probability = $(this)
  //       .find('[itemprop=description]')
  //       .find('span:first')
  //       .text();

  //       probability = probability.split('%')[0];

  //       homeTeam !== '' && Number(probability) > 69 &&
  //         over25.push({
  //           source: 'footy',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));
  //Goalnow
  await axios(url_goalnow)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.goalslink', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        let homeTeam = $(this).find('.goalshome').text();
        const awayTeam = $(this).find('.goalsaway').text();
        homeTeam = homeTeam.split(awayTeam)[0];
        // let homeTeam1 = '';
        // if (homeTeam.includes('2.5 Goals')) {
        //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
        // }

        const pred = $(this).find('.goalstip').find('span:first').text();
        homeTeam !== '' &&
          pred.includes('Under') &&
          under25.push({
            source: 'goalsnow_u25',
            action: 'under25',
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
  //GoalnowAccum
  // await axios(url_gnow_accum)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('.accasdisplay', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this)
  //       .find('.row3:first')
  //       .find('.whitespace')
  //       .text();
  //     // let homeTeam1 = '';
  //     // if (homeTeam.includes('2.5 Goals')) {
  //     //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
  //     // }
  //     // const awayTeam = $(this)
  //     //   .find('.goalsaway')
  //     //   .text();
  //     const pred = $(this)
  //       .find('.row4')
  //       .find('span:first')
  //       .text();
  //     homeTeam !== '' && pred.includes('Over') &&
  //     over25.push({
  //         source: 'gnowAcc',
  //         action: 'over25',
  //         checked: false,
  //         homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //         awayTeam:'',
  //         date: todayString,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));
  // await axios(url_gnow_accum)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.goalslink', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       let homeTeam = $(this)
  //         .find('.goalshome')
  //         .text();

  //       homeTeam = homeTeam.split(awayTeam)[0];
  //       // let homeTeam1 = '';
  //       // if (homeTeam.includes('2.5 Goals')) {
  //       //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
  //       // }
  //       const awayTeam = $(this)
  //         .find('.goalsaway')
  //         .text();
  //       const pred = $(this)
  //         .find('.goalstip')
  //         .find('span:first')
  //         .text();
  //       homeTeam !== '' && pred.includes('Over') &&
  //         over25.push({
  //           source: 'goalsnow',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));
  //Fbpai
  await axios(url_fbpai)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.footgame', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();

        const isUnderFbpai = $(this).find('.match-tip-show').text();

        if (isUnderFbpai === 'Under 2.5') {
          const homeTeam = $(this)
            .find('a:first')
            .attr('title')
            .split(' - ')[0];
          const awayTeam = $(this)
            .find('a:first')
            .attr('title')
            .split(' - ')[1];
          homeTeam !== '' &&
            under25.push({
              source: 'fbpai_u25',
              action: 'under25',
              checked: false,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim().replace('FC ', ''),
              awayTeam,
              date: todayString,
            });
        }
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));
  //ACCUM
  // await axios(url_accum)
  //   .then((response) => {
  //     const html = response.data;
  //     // console.log('000', html);
  //     const $ = cheerio.load(html);
  //     const accumArr = [];

  //     $('.zWPB', html).each(function () {
  //       const accumElem = $(this).find('div:first').text();
  //       const accumDate = $(this).find('.date').text();
  //       // console.log('accumDate', accumDate);
  //       accumArr.push({ team: accumElem, predictionDate: accumDate });
  //     });
  //     // console.log('accumArr', accumArr);
  //     for (let i = 0; i < accumArr.length - 1; i++) {
  //       let accumObj = {
  //         source: 'accum',
  //         action: 'over25',
  //         checked: false,
  //         homeTeam: '',
  //         date: todayString,
  //         predictionDate: '',
  //       };

  //       if (i === 0 || i % 2 === 0) {
  //         // accumObj.homeTeam = accumArr[i].team.trim();
  //         accumObj.homeTeam = getHomeTeamName(accumArr[i].team.trim()) !=='' ? getHomeTeamName(accumArr[i].team.trim()) : accumArr[i].team.trim();
  //         accumObj.predictionDate = accumArr[i + 1].predictionDate;
  //       }
  //       // console.log('accumArr[i]', accumArr[i]);
  //       // console.log('accumObj', accumObj);
  //       accumObj.homeTeam !== '' && over25.push(accumObj);
  //     }
  //   })
  //   .catch((err) => console.log(err));
  //FST
  // await axios(url_fst)
  //   .then((response) => {
  //     const html = response.data;
  //     // const over25 = [];
  //     const $ = cheerio.load(html);

  //     $('.Leg__title', html).each(function () {
  //       const isOver25Fst = $(this).find('.Leg__win').text();
  //       let homeTeam = '';
  //       let awayTeam = '';
  //       if (isOver25Fst === 'Over 2.5 Match Goals') {
  //         homeTeam = $(this).find('.Leg__lose').text().split('vs')[0];
  //         awayTeam = $(this).find('.Leg__lose').text().split('vs')[1];
  //         homeTeam !== '' &&
  //           over25.push({
  //             source: 'fst',
  //             action: 'over25',
  //             checked: false,
  //             homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //             awayTeam,
  //             date: todayString,
  //           });
  //       }
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));


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
        const under25text = $(this).find('.tipdiv').find('span:first').text();
        const under25Yes = under25text === 'Under';
        // console.log('over25Mybets', over25);

        // if (homeTeam.trim() === 'Accrington ST') {
        //   console.log('over25 HT', getHomeTeamName(homeTeam.trim()))
        // };

        homeTeam !== '' &&
          under25Yes &&
          under25.push({
            source: 'mybets_u25',
            action: 'under25',
            checked: false,
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

  let start = 0;
  let next = 1;
  let sortedUnder = under25.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next < sortedUnder.length) {
    if (
      sortedUnder[start].homeTeam.trim() === sortedUnder[next].homeTeam.trim()
    ) {
      if (
        sortedUnder[start].action === sortedUnder[next].action &&
        sortedUnder[start].source === sortedUnder[next].source
      ) {
        sortedUnder.splice(next, 1);
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

  await Under25.insertMany(sortedUnder)
    .then(function () {
      console.log('Under inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('under loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = underRouter;
