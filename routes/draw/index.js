// require express and it's router component
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { getHomeTeamName } = require('../../utils');

// const { ProxyCrawlAPI } = require('proxycrawl');
// const api1 = new ProxyCrawlAPI({ token: 'EJw-eXSc_WyJnMt8-stqjg' });

const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const db = require('../../db');
const { Draw } = require('../../mongo_schema/Draw');
const { correctScore } = require('../../mongo_schema/CorrectScore');

const ORIGIN = process.env.ORIGIN;

const drawRouter = express.Router();

drawRouter.use(cors());
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

let day1 = '03';
if (parseInt(day) < 10) {
  day1 = `0${day}`;
} else {
  day1 = day;
}

let day2 = '';
if (parseInt(dayTom) < 10) {
  day2 = `0${dayTom}`;
} else {
  day2 = dayTom;
}

const url_o25tip =
  'https://www.over25tips.com/soccer-predictions/correct-score/';
  const url_bettingclosed = `https://www.bettingclosed.com/predictions/date-matches/${year}-${month1}-${day1}/bet-type/correct-scores`;
const url_banker = 'https://bankerpredict.com/draws';
const url_trustpredict = 'https://trustpredict.com/draws';
const url_fbp_cs = 'https://footballpredictions.net/correct-score-predictions-betting-tips';
const url_soccertipz = 'https://www.soccertipz.com/draw-predictions/';
const url_soccertipz_cs = 'https://www.soccertipz.com/correct-score/';
const url_vitibet =
  'https://www.vitibet.com/index.php?clanek=quicktips&sekce=fotbal&lang=en';
const url_betwizad = `https://betwizad.com/predictions?date=${year}-${month1}-${day1}`;
// const url_fbp365_cs = 'https://footballprediction365.com/correct-score';
const url_footsuper_cs = 'https://www.footballsuper.tips/todays-correct-score-football-super-tips/';
const url_mybets =
  'https://www.mybets.today/soccer-predictions/';
const url_hello = 'https://hellopredict.com/draws';
const url_passion = `https://passionpredict.com/draws?dt=${year}-${month1}-${day1}`;
const url_r2bet = 'https://r2bet.com/draws';
// const url_betprotips = 'https://betprotips.com/football-tips/1x2-tips/';
const url_venas = 'https://venasbet.com/draws';
// const url_prot = 'https://www.protipster.com/betting-tips/draw';
// const url_betimate = `https://betimate.com/en/football-predictions/under-over-25-goals?date=2023-${month}-${day}`;
const url_betimate = `https://betimate.com/en/football-predictions/predictions-1x2?date=${year}-${month1}-${day1}`;
// const url_gnow_accum = 'https://www.goalsnow.com/accumulator-over-2.5-goals/';
// const url_vitibet =
//   'https://www.vitibet.com/index.php?clanek=tipoftheday&sekce=fotbal&lang=en';

const url_fbpai =
  'https://footballpredictions.ai/football-predictions/1x2-predictions/';
const url_fbpai_cs =
  'https://footballpredictions.ai/football-predictions/correct-score-predictions/';
const url_footsuper =
  'https://www.footballsuper.tips/todays-free-football-super-tips/';
// const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-${month}-${day}T00:00:00Z&to=2023-${month}-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.8&limit=20&minProbability=1&maxProbability=100&odds=UNDER_25&leagueIds=`;
// const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=${year}-${month1}-${day1}T21:00:00Z&to=${year}-${month1}-${day2}T21:00:00Z&minOdd=1.1&maxOdd=5&limit=5&minProbability=1&maxProbability=100&odds=X&leagueIds=`;

// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');
const draws = [];
let correctScoreArr = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
drawRouter.get('/delete', cors(corsOptions), async (req, res) => {
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

  await Draw.deleteMany({ date: req.query.date });
  console.log('Draws deleted'); // Success
  res.send('draws deleted');
  await db.disconnect();
});

drawRouter.get('/get', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const drawsArr = await Draw.find({ date: req.query.date });
  await db.disconnect();

  res.json(drawsArr);
});

drawRouter.post('/save', async (req, res) => {
  let data = req.body;
  // console.log('dataPred', data);
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

// drawRouter.get('/loadWithVpn', cors(corsOptions), async (req, res) => {
//   console.log('drawsWithVpn111');

 
//   let start = 0;
//   let next = 1;
//   let sortedDraws = drawsVpn.sort((a, b) => {
//     if (a.homeTeam < b.homeTeam) {
//       return -1;
//     }
//     if (a.homeTeam > b.homeTeam) {
//       return 1;
//     }
//     return 0;
//   });

//   //удаление дублей
//   while (next < sortedDraws.length) {
//     if (
//       sortedDraws[start].homeTeam.trim() === sortedDraws[next].homeTeam.trim()
//     ) {
//       if (
//         sortedDraws[start].action === sortedDraws[next].action &&
//         sortedDraws[start].source === sortedDraws[next].source
//       ) {
//         sortedDraws.splice(next, 1);
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
//   await Draw.insertMany(sortedDraws)
//     .then(function () {
//       console.log('draws VPN inserted'); // Success
//     })
//     .catch(function (error) {
//       console.log(error); // Failure
//     });

//   await db.disconnect();
//   res.send('draws VPN loaded');
// });

drawRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('draws111', req.query.date);

  //FBP
  // await axios(url_fbp)
  await axios(url_fbp_cs)
    .then((response) => {
      const html = response.data;
      // console.log(response.data);

      
      
      const $ = cheerio.load(html);

      $('.card-body', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.home-team').find('.team-label').text();
        const awayTeam = $(this).find('.away-team').find('.team-label').text();
        let score = $(this).find('.prediction').text().replace('👉\n\n', '').trim();
        // console.log('8888', score);
        let total = score && Number(score.split('-')[0]*1 + score.split('-')[1]*1);
        // const drawYes = drawText.includes('Draw');
        // console.log('total', total);
        // console.log('total2', typeof total);

        const predictionDate = $(this)
          .find('.match-preview-date')
          .find('.full-cloak')
          .text();

          
          // console.log('111', predictionDate);

        homeTeam !== '' &&
        score !== '' &&
        // total !== '' &&
        // !isNaN(total) &&
        predictionDate.includes(`${day1}`) &&
        correctScoreArr.push({
            source: 'fbp_cs',
            score: score,
            total: total,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim().replace('FC ', ''),
            awayTeam,
            date: req.query.date,
            homeTeamWin: score.split('-')[0]*1 > score.split('-')[1]*1 ? 'true' : 'false',
            draw: score.split('-')[0]*1 === score.split('-')[1]*1 ? 'true' : 'false',
            awayTeamWin: score.split('-')[0]*1 < score.split('-')[1]*1 ? 'true' : 'false',
            under25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) < 3 ? 'true' : 'false',
            over25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) > 2 ? 'true' : 'false',
            bttsYespred: (score.split('-')[0]*1 > 0 && score.split('-')[1]*1 > 0) ? 'true' : 'false',
            bttsNopred: (score.split('-')[0]*1 == 0 || score.split('-')[1]*1 == 0) ? 'true' : 'false',
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));


  //bettingclosed
 await axios(url_bettingclosed)
 .then((response) => {
  console.log('url_bettingclosed',url_bettingclosed);
   const html = response.data;

   // console.log('000', html);
   const $ = cheerio.load(html);

   // const body = $('section:nth-child(2) tbody', html);

   $('tr', html).each(function () {
     //<-- cannot be a function expression
     // const title = $(this).text();
     const homeTeam = $(this)
       .find('.teamAmatch')
       .text();

    //  console.log('000', homeTeam);
     const awayTeam = $(this)
       .find('.teamBmatch')
       .text();

     const score = $(this).find('.predMt').text();
     const score1 = score.split('-')[0];
     const score2 = score.split('-')[1];
     const scoreTotal = score1 && score2 && Number(score1*1 + score2*1);

     homeTeam !== '' && !isNaN(scoreTotal) && score1 !== '' && score2 !== '' && correctScoreArr.push({
      source: 'bettingclosed_cs',
      score: `${score1}-${score2}`,
      total: scoreTotal,
      homeTeam: homeTeam.trim(),
      awayTeam: awayTeam.trim(),
      date: req.query.date,
      homeTeamWin: score1*1 > score2*1 ? 'true' : 'false',
      draw: score1*1 === score2*1 ? 'true' : 'false',
      awayTeamWin: score1*1 < score2*1 ? 'true' : 'false',
      under25pred: (score1*1 + score2*1) < 3 ? 'true' : 'false',
      over25pred: (score1*1 + score2*1) > 2 ? 'true' : 'false',
      bttsYespred: (score1*1 > 0 && score2*1 > 0) ? 'true' : 'false',
      bttsNopred: (score1*1 == 0 || score2*1 == 0) ? 'true' : 'false',
    });

 

     // homeTeam !== '' &&
     //   draws.push({
     //     source: 'banker_draw',
     //     action: 'draws',
     //     checked: false,
     //     homeTeam: homeTeam.trim(),
     //     awayTeam: awayTeam.trim(),
     //     date: req.query.date,
     //   });
   });

   //   res.send('banker btts ok');
 })
 .catch((err) => console.log(err));
  //VENAS
  // await axios(url_venas)
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
  //         draws.push({
  //           source: 'venas_draw',
  //           action: 'draws',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim().replace('FC ', ''),
  //           awayTeam:
  //             getHomeTeamName(awayTeam.trim()) !== ''
  //               ? getHomeTeamName(awayTeam.trim())
  //               : awayTeam.trim().replace('FC ', ''),
  //           date: req.query.date,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

    //PROT
  // await axios(url_prot)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('.details-pick', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const teams = $(this).find('.details-pick__match-data__teams').text();
  //     const homeTeam = teams.split(' VS ')[0];
  //     const awayTeam = teams.split(' VS ')[1];

  //     homeTeam !== '' &&
  //       draws.push({
  //         source: 'prot_draw',
  //         action: 'draws',
  //         isAcca: true,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: req.query.date,
  //       });
  //   });

  //   // res.send('prot over loaded');
  // })
  // .catch((err) => console.log(err));

    // betprotips
  // await axios(url_fbp)
  // await axios(url_betprotips)
  // .then((response) => {
  //   const html = response.data;
  //   // console.log(response.data);
  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('.prediction-card', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     // const homeTeam = $(this).find('.teams').find('.home-team').find('span:nth-child(1)').text();
  //     const homeTeam = $(this).find('.teams').find('.home-team').text();
  //     // console.log('homeTeam000', homeTeam);

  //     const awayTeam = $(this).find('.teams').find('.away-team').text();
  //     // console.log('awayTeam000', awayTeam);
  //     const prediction = $(this).find('.advice-row').find('div:nth-child(1)').text();
  //     // console.log('prediction000', prediction);
  //     const underYes = prediction.includes('Over 2.5');
  //     // console.log('over25Fbp', underYes);

  //     homeTeam !== '' &&
  //     underYes &&
  //       over25.push({
  //         source: 'betprotips',
  //         action: 'over25',
  //         checked: false,
  //         homeTeam:
  //           getHomeTeamName(homeTeam.trim()) !== ''
  //             ? getHomeTeamName(homeTeam.trim())
  //             : homeTeam.trim().replace('FC ', ''),
  //         awayTeam,
  //         date: todayString,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

     //hello
  // await axios(url_hello)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('tr', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this)
  //       .find('.tab_b_match')
  //       .find('span:first')
  //       .text()
  //       .split('VS')[0];
  //     const awayTeam = $(this)
  //       .find('.tab_b_match')
  //       .find('span:first')
  //       .text()
  //       .split('VS')[1];

  //     homeTeam !== '' &&
  //       draws.push({
  //         source: 'hello_draw',
  //         action: 'draws',
  //         checked: false,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: req.query.date,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

   
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
  //       draws.push({
  //         source: 'banker_draw',
  //         action: 'draws',
  //         checked: false,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: req.query.date,
  //       });
  //   });

  //   //   res.send('banker btts ok');
  // })
  // .catch((err) => console.log(err));

  //trustpredict
  // await axios(url_trustpredict)
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

  //     // const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];
  //     // const tip = $(this).find('td:nth-child(4)').text();

  //     homeTeam !== '' &&
  //       draws.push({
  //         source: 'trustpredict_draw',
  //         action: 'draws',
  //         isAcca: false,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: req.query.date,
  //       });
  //   });

  //   // res.send('hello over loaded');
  // })
  // .catch((err) => console.log(err));

    //betimate
    // await axios(url_betimate)
    // .then((response) => {
    //   const html = response.data;
    //   // console.log(response.data);
    //  //  console.log('000', html);
    //   const $ = cheerio.load(html);
  
    //   $('.prediction-body', html).each(function () {
    //     //<-- cannot be a function expression
    //     // const title = $(this).text();
    //     const homeTeam = $(this).find('.homeTeam').text();
    //    //  console.log('homeTeam000', homeTeam);

    //     const awayTeam = $(this).find('.awayTeam').text();
    //     const date = $(this).find('.date_bah').text();
    //    //  console.log('date111', date);
    //    //  console.log('date222', `${month}/${day}`);
  
    //     let probabilityDraw = '';
  
    //     const prediction = $(this).find('.predict').find('span').text();
    //    //  console.log('prediction000', prediction);
  
    //     const drawYes = prediction.includes('X');
  
    //     if (drawYes) {
    //       probabilityDraw = $(this).find('.probability').find('div:nth-child(2)').text();
    //     }
    //    //  console.log('over25Fbp', probabilityUnder);
  
    //     homeTeam !== '' && date.includes(`${month1}/${day1}`) &&
    //     drawYes &&
    //       draws.push({
    //         source: 'betimate_draw',
    //         action: `draws ${probabilityDraw}`,
    //         checked: false,
    //         homeTeam:
    //           getHomeTeamName(homeTeam.trim()) !== ''
    //             ? getHomeTeamName(homeTeam.trim())
    //             : homeTeam.trim().replace('FC ', ''),
    //         awayTeam,
    //         date: req.query.date,
    //       });
    //   });
  
    //   // res.json(over25);
    // })
    // .catch((err) => console.log(err));

    //betimate_cs
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
  
        // let probabilityDraw = '';
  
        const score = $(this).find('.score').text();

        const scoreTotal = score && (Number(score.split('-')[0]*1 + score.split('-')[1]*1));
       //  console.log('prediction000', prediction);
  
        // const drawYes = prediction.includes('X');
  
        // if (drawYes) {
        //   probabilityDraw = $(this).find('.probability').find('div:nth-child(2)').text();
        // }
       //  console.log('over25Fbp', probabilityUnder);
  
        homeTeam !== '' && !isNaN(scoreTotal) && score !== '' && date.includes(`${month1}/${day1}`) &&
          correctScoreArr.push({
            source: 'betimate_cs',
            score: score && score,
            total: scoreTotal,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim().replace('FC ', ''),
            awayTeam,
            date: req.query.date,
            homeTeamWin: score.split('-')[0]*1 > score.split('-')[1]*1 ? 'true' : 'false',
            draw: score.split('-')[0]*1 === score.split('-')[1]*1 ? 'true' : 'false',
            awayTeamWin: score.split('-')[0]*1 < score.split('-')[1]*1 ? 'true' : 'false',
            under25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) < 3 ? 'true' : 'false',
            over25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) > 2 ? 'true' : 'false',
            bttsYespred: (score.split('-')[0]*1 > 0 && score.split('-')[1]*1 > 0) ? 'true' : 'false',
            bttsNopred: (score.split('-')[0]*1 == 0 || score.split('-')[1]*1 == 0) ? 'true' : 'false',
          });
      });
  
      // res.json(over25);
    })
    .catch((err) => console.log(err));

    

    //PREDUTD
    // await axios(url_predutd)
    // .then((response) => {
    //   const html = response.data;

    //   // console.log('000', html);
    //   const $ = cheerio.load(html);

    //   const body = $('#mainRow', html).find('div:nth-child(2)').find('div:nth-child(1)');

    //   $('div', body).each(function () {
    //     //<-- cannot be a function expression
    //     // const title = $(this).text();
    //     const homeTeam = $(this)
    //       .find('th')
    //       .text()
    //       .split(' - ')[0];

    //       const awayTeam = $(this)
    //       .find('th')
    //       .text()
    //       .split(' - ')[1];

    //       // console.log('predutdU25', homeTeam);

    //     homeTeam !== '' &&
    //     under25.push({
    //         source: 'predutd',
    //         action: 'under25',
    //         checked: false,
    //         homeTeam: homeTeam.trim(),
    //         awayTeam: awayTeam.trim(),
    //         date: todayString,
    //       });
    //   });

    //   // res.send('banker over loaded');
    // })
    // .catch((err) => console.log(err));

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

  //       const isDraw = score1 * 1 === score2 * 1;

  //       homeTeam !== '' &&
  //         date.includes(`${day}.${month}`) &&
  //         isDraw &&
  //         draws.push({
  //           source: 'vitibet_draw',
  //           action: 'draws',
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

  //       homeTeam &&
  //         homeTeam !== '' &&
  //         awayTeam &&
  //         awayTeam !== '' &&
  //         draws.push({
  //           source: 'soccertipz_draw',
  //           action: 'draws',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim(),
  //           awayTeam:
  //             getHomeTeamName(awayTeam.trim()) !== ''
  //               ? getHomeTeamName(awayTeam.trim())
  //               : awayTeam.trim(),
  //           date: req.query.date,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));
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

      console.log('homeTeam111222', homeTeam);


      const score = $(this).find('.col-7').find('.leftbar').find('div:nth-child(6)').text();
      const score1 = score.split('-')[0];
      const score2 = score.split('-')[1];

      const scoreTotal = score1 && score2 && Number(score1*1 + score2*1);
      

      homeTeam !== '' && !isNaN(scoreTotal) && score1 !== '' && score2 !== '' && correctScoreArr.push({
        source: 'betwizad_cs',
        score: `${score1}-${score2}`,
        total: scoreTotal,
        homeTeam: homeTeam.trim(),
        awayTeam: awayTeam.trim(),
        date: req.query.date,
        homeTeamWin: score1*1 > score2*1 ? 'true' : 'false',
        draw: score1*1 === score2*1 ? 'true' : 'false',
        awayTeamWin: score1*1 < score2*1 ? 'true' : 'false'
      });

   
    });

    // res.send('hello over loaded');
  })
  .catch((err) => console.log(err));

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
  //       const homeTeam = $(this).find('td:nth-child(3)').text();
  //       const awayTeam = $(this).find('td:nth-child(4)').text();
  //       const score1 = $(this).find('td:nth-child(6)').text();
  //       const score2 = $(this).find('td:nth-child(8)').text();
  //       // const tip = $(this).find('td:nth-child(12)').text();


  //       homeTeam !== '' && score1 !== '' && score2 !== '' && correctScoreArr.push({
  //         source: 'vitibet_cs',
  //         score: `${score1}-${score2}`,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: todayString,
  //       });


  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));

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
        // const scoreTotal = score1 * 1 + score2 * 1;
        const isDraw = score1 * 1 === score2 * 1;
        // console.log('bttsYes', bttsYes);
        // console.log('homeTeam', homeTeam);
        // console.log('tip222', tip);

        // homeTeam !== '' && score1 !== '' && score2 !== '' && correctScoreArr.push({
        //   source: 'vitibet_cs',
        //   score: `${score1}-${score2}`,
        //   homeTeam: homeTeam.trim(),
        //   awayTeam: awayTeam.trim(),
        //   date: req.query.date,
        // });

        // if (isDraw) {
        //   homeTeam !== '' &&
        //     date.includes(`${day1}.${month1}`) &&
        //     draws.push({
        //       source: 'vitibet_draw',
        //       action: 'draws',
        //       isAcca: false,
        //       homeTeam: homeTeam.trim(),
        //       awayTeam: awayTeam.trim(),
        //       date: req.query.date,
        //     });
        // }

        const scoreTotal = score1 && score2 && Number(score1*1 + score2*1);

        homeTeam !== '' && !isNaN(scoreTotal) && score1 !== '' && score2 !== '' && correctScoreArr.push({
          source: 'vitibet_cs',
          score: `${score1}-${score2}`,
          total: scoreTotal,
          homeTeam: homeTeam.trim(),
          awayTeam: awayTeam.trim(),
          date: req.query.date,
          homeTeamWin: score1*1 > score2*1 ? 'true' : 'false',
          draw: score1*1 === score2*1 ? 'true' : 'false',
          awayTeamWin: score1*1 < score2*1 ? 'true' : 'false',
          under25pred: (score1*1 + score2*1) < 3 ? 'true' : 'false',
          over25pred: (score1*1 + score2*1) > 2 ? 'true' : 'false',
          bttsYespred: (score1*1 > 0 && score2*1 > 0) ? 'true' : 'false',
          bttsNopred: (score1*1 == 0 || score2*1 == 0) ? 'true' : 'false',
        });
        // if (scoreTotal >= 3) {
        //   homeTeam !== '' &&
        //     date.includes(`${day1}.${month1}`) &&
        //     over25.push({
        //       source: 'vitibet_o25',
        //       action: 'over25',
        //       checked: false,
        //       homeTeam: homeTeam.trim(),
        //       awayTeam: awayTeam.trim(),
        //       date: req.query.date,
        //     });
        // }
      
        // if (scoreTotal <= 2) {
        //   homeTeam !== '' &&
        //     date.includes(`${day1}.${month1}`) &&
        //     under25.push({
        //       source: 'vitibet_u25',
        //       action: 'under25',
        //       isAcca: false,
        //       homeTeam: homeTeam.trim(),
        //       awayTeam: awayTeam.trim(),
        //       date: req.query.date,
        //     });
        // }
        // if (tip === '1' || tip === '2') {
        //   homeTeam !== '' &&
        //     date.includes(`${day1}.${month1}`) &&
        //     winData.push({
        //       source: 'vitibet_win',
        //       action: 'win',
        //       checked: false,
        //       homeTeam: homeTeam.trim(),
        //       awayTeam: awayTeam.trim(),
        //       date: req.query.date,
        //       prediction: tip === '1' ? homeTeam.trim() : awayTeam.trim(),
        //     });
        // }

        // homeTeam !== '' &&
        //   date.includes(`${day1}.${month1}`) &&
        //   btts.push({
        //     source: 'vitibet_btts',
        //     action: bttsYes ? 'btts' : 'btts no',
        //     isAcca: false,
        //     homeTeam: homeTeam.trim(),
        //     awayTeam: awayTeam.trim(),
        //     date: req.query.date,
        //   });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));


  //SOCCERTIPZ_CS
  await axios(url_soccertipz_cs)
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
        const score = $(this)
          .find('td:nth-child(3)')
          .text().replace(' ','');

          const scoreTotal = score && Number(score.split('-')[0]*1 + score.split('-')[1]*1);

          homeTeam !== '' && score !== '' && !isNaN(scoreTotal) &&
          correctScoreArr.push({
            source: 'soccertipz_cs',
            score: score,
            total: scoreTotal,
            homeTeam: getHomeTeamName(homeTeam.trim()) !== ''
            ? getHomeTeamName(homeTeam.trim())
            : homeTeam.trim(),
            awayTeam: awayTeam,
            date: req.query.date,
            homeTeamWin: score.split('-')[0]*1 > score.split('-')[1]*1 ? 'true' : 'false',
            draw: score.split('-')[0]*1 === score.split('-')[1]*1 ? 'true' : 'false',
            awayTeamWin: score.split('-')[0]*1 < score.split('-')[1]*1 ? 'true' : 'false',
            under25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) < 3 ? 'true' : 'false',
            over25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) > 2 ? 'true' : 'false',
            bttsYespred: (score.split('-')[0]*1 > 0 && score.split('-')[1]*1 > 0) ? 'true' : 'false',
            bttsNopred: (score.split('-')[0]*1 == 0 || score.split('-')[1]*1 == 0) ? 'true' : 'false',
          });

        // homeTeam &&
        //   homeTeam !== '' &&
        //   awayTeam &&
        //   awayTeam !== '' &&
        //   draws.push({
        //     source: 'soccertipz_draw',
        //     action: 'draws',
        //     checked: false,
        //     homeTeam:
        //       getHomeTeamName(homeTeam.trim()) !== ''
        //         ? getHomeTeamName(homeTeam.trim())
        //         : homeTeam.trim(),
        //     awayTeam:
        //       getHomeTeamName(awayTeam.trim()) !== ''
        //         ? getHomeTeamName(awayTeam.trim())
        //         : awayTeam.trim(),
        //     date: todayString,
        //   });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

      //fbp365
  // await axios(url_fbp365_cs)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('.fullgame', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     //  const homeTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(1)').text();
  //     //  const awayTeam = $(this).find('div:nth-child(2)').find('div:nth-child(1)').find('div:nth-child(2)').text();
  //     //  const tip = $(this).find('div:nth-child(3)').find('div:nth-child(1)').text();

  //     const homeTeam = $(this)
  //       .find('.dividehome')
  //       .find('div:nth-child(1)')
  //       .find('div:nth-child(1)')
  //       .text();
  //     //  console.log('homeTeam000', homeTeam.trim());
  //     const awayTeam = $(this)
  //       .find('.divideaway')
  //       .find('div:nth-child(1)')
  //       .find('div:nth-child(1)')
  //       .text();
  //     //  console.log('awayTeam000', awayTeam.trim());
  //     const score = $(this)
  //       .find('.spantip')
  //       .text();
  //     //  console.log('tip000', tip);

  //     homeTeam !== '' && score !== '' &&
  //     correctScoreArr.push({
  //       source: 'fbp365_cs',
  //       score: score,
  //       homeTeam: getHomeTeamName(homeTeam.trim()) !== ''
  //       ? getHomeTeamName(homeTeam.trim())
  //       : homeTeam.trim(),
  //       awayTeam: getHomeTeamName(awayTeam.trim()) !== ''
  //       ? getHomeTeamName(awayTeam.trim())
  //       : awayTeam.trim(),
  //       date: req.query.date,
  //       });
  //   });

  //   // res.send('r2bet over loaded');
  // })
  // .catch((err) => console.log(err));

  //footsuper
  await axios(url_footsuper_cs)
  .then((response) => {
    const html = response.data;

    // console.log('000', html);
    const $ = cheerio.load(html);

    $('.pool_list_item', html).each(function () {
      //<-- cannot be a function expression
      // const title = $(this).text();
      const homeTeam = $(this).find('.homedisp').text();
      const awayTeam = $(this).find('.awaydisp').text();
      const score = $(this).find('.prediresults').text();

      const scoreTotal = score && Number(score.split('-')[0]*1 + score.split('-')[1]*1);

      homeTeam !== '' && score !== '' && !isNaN(scoreTotal) &&
      correctScoreArr.push({
        source: 'footsuper_cs',
        score: score,
        total: scoreTotal,
        homeTeam: getHomeTeamName(homeTeam.trim()) !== ''
        ? getHomeTeamName(homeTeam.trim())
        : homeTeam.trim(),
        awayTeam: getHomeTeamName(awayTeam.trim()) !== ''
        ? getHomeTeamName(awayTeam.trim())
        : awayTeam.trim(),
        date: req.query.date,
        homeTeamWin: score.split('-')[0]*1 > score.split('-')[1]*1 ? 'true' : 'false',
        draw: score.split('-')[0]*1 === score.split('-')[1]*1 ? 'true' : 'false',
        awayTeamWin: score.split('-')[0]*1 < score.split('-')[1]*1 ? 'true' : 'false',
        under25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) < 3 ? 'true' : 'false',
        over25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) > 2 ? 'true' : 'false',
        bttsYespred: (score.split('-')[0]*1 > 0 && score.split('-')[1]*1 > 0) ? 'true' : 'false',
        bttsNopred: (score.split('-')[0]*1 == 0 || score.split('-')[1]*1 == 0) ? 'true' : 'false',
      });

      
    });

    // res.send('r2bet over loaded');
  })
  .catch((err) => console.log(err));

  // // //MINES
  // await axios(url_mines)
  //   .then((response) => {
  //     const data = response.data;
  //     console.log('minesUnder', data);

  //     data.forEach((elem) => {
  //       elem !== '' && elem.bestOddProbability > 74 &&
  //         under25.push({
  //           source: 'mines',
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
  // await axios(url_footsuper)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.pool_list_item', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this).find('.homedisp').text();
  //       const awayTeam = $(this).find('.awaydisp').text();

  //       const pred = $(this).find('.prediresults').text();
  //       const percent = $(this).find('.biggestpercen').text();

  //       homeTeam !== '' &&
  //         pred.includes('X') &&
  //         parseInt(percent) > 44 &&
  //         draws.push({
  //           source: 'footsuper_draw',
  //           action: 'draws',
  //           isAcca: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: req.query.date,
  //           prediction:
  //             (pred.includes('1') && homeTeam) ||
  //             (pred.includes('2') && awayTeam),
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

    // MINES;
  // await axios(url_mines)
  // .then((response) => {
  //   const data = response.data;

  //   data.forEach((elem) => {
  //     console.log('elemMinesDraw',elem);
  //     elem !== '' &&
  //       elem.bestOddProbability > 69 &&
  //       draws.push({
  //         source: 'mines_draw',
  //         action: `draw ${elem.bestOdd} ${elem.bestOddProbability}%`,
  //         homeTeam: elem.localTeam.name,
  //         awayTeam: elem.visitorTeam.name,
  //         date: req.query.date,
  //       });
  //   });

  //   // res.json(btts);
  // })
  // .catch((err) => console.log(err));

  // //PASSION
  // await axios(url_passion)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);
  //     let homeTeamsArr = [];

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('td:nth-child(3)')
  //         .find('span:first')
  //         .text()
  //         .split(' VS')[0];
  //       homeTeamsArr.push(homeTeam);
  //     });
  //     homeTeamsArr.splice(0, 1);
  //     let indexOfEmpty = homeTeamsArr.indexOf('');
  //     let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
  //     todayHomeTeamsArr.forEach((elem) => {
  //       elem !== '' &&
  //         draws.push({
  //           source: 'passion_draw',
  //           action: 'draws',
  //           homeTeam: elem,
  //           awayTeam: '',
  //           prediction: elem,
  //           date: req.query.date,
  //         });
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));


  //r2bet
  // await axios(url_r2bet)
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
  //         draws.push({
  //           source: 'r2bet_draw',
  //           action: 'draws',
  //           checked: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: req.query.date,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

 
  //Fbpai
  // await axios(url_fbpai)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.footgame', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       const isDrawFbpai = $(this).find('.match-tip-show').text();

  //       if (isDrawFbpai === 'X') {
  //         const homeTeam = $(this)
  //           .find('a:first')
  //           .attr('title')
  //           .split(' - ')[0];
  //         const awayTeam = $(this)
  //           .find('a:first')
  //           .attr('title')
  //           .split(' - ')[1];
  //         homeTeam !== '' &&
  //           draws.push({
  //             source: 'fbpai_draw',
  //             action: 'draws',
  //             checked: false,
  //             homeTeam:
  //               getHomeTeamName(homeTeam.trim()) !== ''
  //                 ? getHomeTeamName(homeTeam.trim())
  //                 : homeTeam.trim().replace('FC ', ''),
  //             awayTeam,
  //             date: req.query.date,
  //           });
  //       }
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //Fbpai_cs
  await axios(url_fbpai_cs)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.footgame', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();

        const score = $(this).find('.match-tip-show').text();

        const scoreTotal = score && Number(score.split('-')[0]*1 + score.split('-')[1]*1);

          const homeTeam = $(this)
            .find('a:first')
            .attr('title')
            .split(' - ')[0];
          const awayTeam = $(this)
            .find('a:first')
            .attr('title')
            .split(' - ')[1];
          homeTeam !== '' && score !== '' && !isNaN(scoreTotal) &&
            correctScoreArr.push({
              source: 'fbpai_cs',
              score: score,
              total: scoreTotal,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim().replace('FC ', ''),
              awayTeam,
              date: req.query.date,
              homeTeamWin: score.split('-')[0]*1 > score.split('-')[1]*1 ? 'true' : 'false',
              draw: score.split('-')[0]*1 === score.split('-')[1]*1 ? 'true' : 'false',
              awayTeamWin: score.split('-')[0]*1 < score.split('-')[1]*1 ? 'true' : 'false',
              under25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) < 3 ? 'true' : 'false',
              over25pred: (score.split('-')[0]*1 + score.split('-')[1]*1) > 2 ? 'true' : 'false',
              bttsYespred: (score.split('-')[0]*1 > 0 && score.split('-')[1]*1 > 0) ? 'true' : 'false',
              bttsNopred: (score.split('-')[0]*1 == 0 || score.split('-')[1]*1 == 0) ? 'true' : 'false',
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
  //       const under25text = $(this).find('.tipdiv').find('span:first').text();
  //       const under25Yes = under25text === 'X';
  //       // console.log('over25Mybets', over25);

  //       // if (homeTeam.trim() === 'Accrington ST') {
  //       //   console.log('over25 HT', getHomeTeamName(homeTeam.trim()))
  //       // };

  //       homeTeam !== '' &&
  //         under25Yes &&
  //         draws.push({
  //           source: 'mybets_draw',
  //           action: 'draws',
  //           checked: false,
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

  let start = 0;
  let next = 1;
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
  while (next < sortedDraws.length) {
    if (
      sortedDraws[start].homeTeam.trim() === sortedDraws[next].homeTeam.trim()
    ) {
      if (
        sortedDraws[start].action === sortedDraws[next].action &&
        sortedDraws[start].source === sortedDraws[next].source
      ) {
        sortedDraws.splice(next, 1);
      }
    }

    start++;
    next++;
  }

  // console.log('sortedDraws',sortedDraws);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await Draw.insertMany(sortedDraws)
  //   .then(function () {
  //     console.log('Draws inserted'); // Success
  //   })
  //   .catch(function (error) {
  //     console.log(error); // Failure
  //   });

    // console.log('correctScoreArr', correctScoreArr);

    // correctScoreArr.forEach(elem => {
    //   if (typeof elem.total !== 'number') {
    //     console.log('elem777', elem);
    //   }
    // })

    await correctScore.deleteMany({ date: req.query.date });
    
    await correctScore.insertMany(correctScoreArr)
      .then(function () {
        console.log('correctScore inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

  await db.disconnect();
  res.send(correctScoreArr);
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = drawRouter;
