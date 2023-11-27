// require express and it's router component
const express = require('express');
const { ProxyCrawlAPI } = require('proxycrawl');
const api1 = new ProxyCrawlAPI({ token: 'IpErJSu5VcdhkKqgLRJiwQ' });
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { getHomeTeamName } = require('../../utils');

const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const db = require('../../db');
// const { default: puppeteer } = require('puppeteer');
// const { Under25 } = require('../../mongo_schema/Under25');

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
const formattedTomorrow = fns.format(tomorrow, 'dd.MM.yyyy');
const formattedToday = fns.format(today, 'dd.MM.yyyy');
const yesterdayString = formattedYesterday.toString();
const tomorrowString = formattedTomorrow.toString();
const todayString = formattedToday.toString();
const year = today.getFullYear();
let day = today.getDate();
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

const url_bettingtips =
  'https://www.bettingtips.today/football-accumulators-tips/';

const url_betclan = 'https://www.betclan.com/accumulator-tips-for-today/';
const url_fbp365 = 'https://footballprediction365.com/win-treble-tips';

const url_betshoot_o25 =
  'https://www.betshoot.com/football/over-25-goals-tips/';
const url_betshoot_btts =
  'https://www.betshoot.com/football/both-teams-to-score-tips/';
const url_goalnow =
  'https://www.goalsnow.com/accumulator-btts-both-teams-to-score/';
const url_predutd =
  'https://www.forebet.com/en/football-tips-and-predictions-for-today/predictions-1x2';
const url_vitibet =
  'https://www.vitibet.com/index.php?clanek=quicktips&sekce=fotbal&lang=en';
const url_venasbet = 'https://venasbet.com/under_3_5_goals';
const url_trustpredict = 'https://trustpredict.com/both-team-to-score';
const url_soccertipz = 'https://www.soccertipz.com/under-over-2-5-predictions/';
const url_r2bet = 'https://r2bet.com/under_3_5_goals';
const url_betprotips = 'https://betprotips.com/football-tips/over-under-tips/';
// const url_betimate = `https://betimate.com/en/football-predictions/predictions-1x2?date=2023-${month}-${day}`;
const url_freepredicts = `https://freepredicts.com/`;
const url_soccerpunt = `https://soccerpunt.com/`;
// const url_wininbets = `https://wininbets.com/both-teams-to-score-tips`;
// const url_wininbets = 'https://wininbets.com/under-over-predictions';
const url_bettingtips1x2 = 'https://bettingtips1x2.com/';
// const url_betwizad = 'https://betwizad.com/predictions';
const url_betwizad = `https://betwizad.com/predictions?date=${year}-${month1}-${day1}`;

const url_bigfree = 'https://bigfreetips.com/sure-bets-today/';
const url_kingspredict = 'https://kingspredict.com/Double_chance';
const url_victorspredict = 'https://victorspredict.com/store/draws';
const url_fbp2 = 'https://footballpredictions.com/footballpredictions/';

// const url_vitibet =
//   'https://www.vitibet.com/index.php?clanek=tipoftheday&sekce=fotbal&lang=en';
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
const btts = [];
// Create POST route to create an todo
// router.post('/todo/create', create);
// Create GET route to read an todo
// underRouter.get('/delete', cors(corsOptions), async (req, res) => {
//   // const today = new Date();
//   // const formattedToday = fns.format(today, 'dd.MM.yyyy');
//   // const todayString = formattedToday.toString();

//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   await Under25.deleteMany({ date: req.query.date });
//   console.log('Under deleted'); // Success
//   res.send('under deleted');
//   await db.disconnect();
// });

// underRouter.get('/get', async (req, res) => {
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   const under25Arr = await Under25.find({ date: req.query.date });
//   await db.disconnect();

//   res.json(under25Arr);
// });

// underRouter.post('/save', async (req, res) => {
//   let data = req.body;
//   console.log('dataPred', data);
//   if (data.homeTeam.length !== 0) {
//     data.homeTeam.forEach(async (elem) => {
//       const newBttsObj = {
//         source: data.source,
//         action: data.action,
//         homeTeam: getHomeTeamName(elem) !== '' ? getHomeTeamName(elem) : elem,
//         predTeam:
//           getHomeTeamName(data.predTeam) !== ''
//             ? getHomeTeamName(data.predTeam)
//             : data.predTeam,
//         date: data.date,
//         isAcca: data.isAcca,
//       };

//       mongoose.connect(
//         'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//         {
//           useNewUrlParser: true,
//           // useCreateIndex: true,
//           useUnifiedTopology: true,
//         }
//       );
//       let newUnder = await new Under25(newBttsObj);
//       await newUnder.save(function (err) {
//         if (err) return console.error(err);
//         console.log('new Under saved succussfully!');
//       });

//       await db.disconnect();
//     });
//     console.log('new preds saved succussfully!');
//   }

//   res.json('new preds inserted');
// });

underRouter.get('/load', cors(corsOptions), async (req, res) => {
  console.log('test111');

   // //VITIBET
  // 
  
  //wininbets
  // await axios(url_betwizad)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   // const body = $('section:nth-child(2) tbody', html);

  //   $('.drow', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[0];
  //     const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];

  //     const score = $(this).find('.col-7').find('.leftbar').find('div:nth-child(6)').text();
  //     const score1 = score.split('-')[0];
  //     const score2 = score.split('-')[1];
      
      
  //     const isDraw = score1 * 1 === score2 * 1;
  //     const homeScore = score1 > 0;
  //     const awayScore = score2 > 0;

  //     const bttsYes = homeScore && awayScore;
  //     const scoreTotal = score1 * 1 + score2 * 1;
  //     const win1 = score1 * 1 > score2 * 1;
  //     const win2 = score1 * 1 < score2 * 1;

  //     // console.log('homeTeam', homeTeam.trim());
  //     // console.log('awayTeam', awayTeam.trim());
  //     // console.log('cs', cs);
      
  //     homeTeam !== '' &&
  //         btts.push({
  //           source: 'betwizad_btts',
  //           action: bttsYes ? 'btts' : 'btts no',
  //           isAcca: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //         });
  //       homeTeam !== '' &&
  //         isDraw &&
  //         btts.push({
  //           source: 'betwizad_draw',
  //           action: 'draws',
  //           isAcca: false,
  //           homeTeam: homeTeam.trim(),
  //           awayTeam: awayTeam.trim(),
  //           date: todayString,
  //         });
  //         if (scoreTotal >= 3) {
  //           homeTeam !== '' &&
  //           btts.push({
  //               source: 'betwizad_o25',
  //               action: 'over25',
  //               checked: false,
  //               homeTeam: homeTeam.trim(),
  //               awayTeam: awayTeam.trim(),
  //               date: todayString,
  //             });
  //         }
  //         if (scoreTotal <= 2) {
  //           homeTeam !== '' &&
  //           btts.push({
  //               source: 'betwizad_u25',
  //               action: 'under25',
  //               isAcca: false,
  //               homeTeam: homeTeam.trim(),
  //               awayTeam: awayTeam.trim(),
  //               date: todayString,
  //             });
  //         }
  //         if (win1 || win2) {
  //           homeTeam !== '' &&
  //           btts.push({
  //               source: 'betwizad_win',
  //               action: 'win',
  //               checked: false,
  //               homeTeam: homeTeam.trim(),
  //               awayTeam: awayTeam.trim(),
  //               date: todayString,
  //               prediction: win1 ? homeTeam.trim() : awayTeam.trim(),
  //             });
  //         }
   
  //   });

  //   // res.send('hello over loaded');
  // })
  // .catch((err) => console.log(err));

  // await api1
  //   .get(url_vitibet)
  //   .then((response) => {
  // if (response.statusCode === 200 && response.originalStatus === 200) {
  //   // console.log('000', response.body);
  //   const html = response.body;
  //   // console.log(response.data);
  //   console.log('000', html);
  //       const $ = cheerio.load(html);

  //       $('tr', html).each(function () {
  //         //<-- cannot be a function expression
  //         // const title = $(this).text();
  //         const date = $(this).find('td:nth-child(1)').text();
  //         console.log('111', date);
   
  //         const homeTeam = $(this).find('td:nth-child(2)').text();
  //         console.log('222', homeTeam);
   
  //         const awayTeam = $(this).find('td:nth-child(3)').text();
  //         const score1 = $(this).find('td:nth-child(4)').text();
  //         const score2 = $(this).find('td:nth-child(6)').text();
   
  //         const isDraw = score1 * 1 === score2 * 1;
   
  //         homeTeam !== '' &&
  //           // date.includes(`${day}.${month}`) &&
  //           // isDraw &&
  //           btts.push({
  //             source: 'vitibet_draw',
  //             action: 'draws',
  //             isAcca: false,
  //             homeTeam: homeTeam.trim(),
  //             awayTeam: awayTeam.trim(),
  //             date: todayString,
  //           });
  //       });

  //     } else {
  //       console.log('Failed: ', response.statusCode, response.originalStatus);
  //     }

  //     // res.send('bettingtips crawl loaded');
  //   })
  //   .catch((err) => console.log(err));

  //   console.log('btts', btts);

  // await axios(url_bettingtips1x2)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   // const body = $('section:nth-child(2) tbody', html);

  //   $('.pttr', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this).find('.ptmobh').text();
  //     const awayTeam = $(this).find('.ptmoba').text();
  //     // const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];

  //     const score = $(this).find('.ptpredboxsml').text();
  //     // const score1 = score.split('-')[0];
  //     // const score2 = score.split('-')[1];

  //     console.log('homeTeam', homeTeam);
  //     console.log('awayTeam', awayTeam);
  //     console.log('score', score);
      
      
  //     // const isDraw = score1 * 1 === score2 * 1;
  //     // const homeScore = score1 > 0;
  //     // const awayScore = score2 > 0;

  //     // const bttsYes = homeScore && awayScore;
  //     // const scoreTotal = score1 * 1 + score2 * 1;
  //     // const win1 = score1 * 1 > score2 * 1;
  //     // const win2 = score1 * 1 < score2 * 1;

      
      
  //     // homeTeam !== '' &&
  //     //     btts.push({
  //     //       source: 'betwizad_btts',
  //     //       action: bttsYes ? 'btts' : 'btts no',
  //     //       isAcca: false,
  //     //       homeTeam: homeTeam.trim(),
  //     //       awayTeam: awayTeam.trim(),
  //     //       date: todayString,
  //     //     });
  //     //   homeTeam !== '' &&
  //     //     isDraw &&
  //     //     btts.push({
  //     //       source: 'betwizad_draw',
  //     //       action: 'draws',
  //     //       isAcca: false,
  //     //       homeTeam: homeTeam.trim(),
  //     //       awayTeam: awayTeam.trim(),
  //     //       date: todayString,
  //     //     });
  //     //     if (scoreTotal >= 3) {
  //     //       homeTeam !== '' &&
  //     //       btts.push({
  //     //           source: 'betwizad_o25',
  //     //           action: 'over25',
  //     //           checked: false,
  //     //           homeTeam: homeTeam.trim(),
  //     //           awayTeam: awayTeam.trim(),
  //     //           date: todayString,
  //     //         });
  //     //     }
  //     //     if (scoreTotal <= 2) {
  //     //       homeTeam !== '' &&
  //     //       btts.push({
  //     //           source: 'betwizad_u25',
  //     //           action: 'under25',
  //     //           isAcca: false,
  //     //           homeTeam: homeTeam.trim(),
  //     //           awayTeam: awayTeam.trim(),
  //     //           date: todayString,
  //     //         });
  //     //     }
  //     //     if (win1 || win2) {
  //     //       homeTeam !== '' &&
  //     //       btts.push({
  //     //           source: 'betwizad_win',
  //     //           action: 'win',
  //     //           checked: false,
  //     //           homeTeam: homeTeam.trim(),
  //     //           awayTeam: awayTeam.trim(),
  //     //           date: todayString,
  //     //           prediction: win1 ? homeTeam.trim() : awayTeam.trim(),
  //     //         });
  //     //     }
   
  //   });

  //   // res.send('hello over loaded');
  // })
  // .catch((err) => console.log(err));

    //wininbets
  await axios(url_vitibet)
  .then((response) => {
    const html = response.data;

    // console.log('000', html);
    const $ = cheerio.load(html);

    // const body = $('section:nth-child(2) tbody', html);

    $('tr', html).each(function () {
      //<-- cannot be a function expression
      // const title = $(this).text();
      const date = $(this).find('td:nth-child(1)').text();
      console.log('111', date);

      // const homeTeam = $(this).find('td:nth-child(2)').text();
      

      const homeTeam = $(this).find('td:nth-child(3)').text();
      console.log('222', homeTeam);
      const awayTeam = $(this).find('td:nth-child(4)').text();
      console.log('333', awayTeam);
      const score1 = $(this).find('td:nth-child(6)').text();
      const score2 = $(this).find('td:nth-child(8)').text();
      const tip = $(this).find('td:nth-child(12)').text();
      console.log('444', score1);
      console.log('555', score2);
      console.log('555', tip);

      // const isDraw = score1 * 1 === score2 * 1;

      homeTeam !== '' &&
        date.includes(`${day}.${month}`) &&
        // isDraw &&
        btts.push({
          source: 'vitibet_draw',
          action: 'draws',
          isAcca: false,
          homeTeam: homeTeam.trim(),
          awayTeam: awayTeam.trim(),
          date: todayString,
        });
    });
    // res.send('hello over loaded');
  })
  .catch((err) => console.log(err));

  // console.log('btts2222', btts);

 

  // console.log('btts2222', btts);

  // const browser = await puppeteer.launch({
  //   headless: false,
  //   defaultViewport: null,
  // });

  // const page = await browser.newPage(); // open browser
  // // await page.goto(url_predutd); // go to the page

  // await page.goto(url_predutd, {
  //   waitUntil: 'networkidle0',
  // });

  // await page.click('#mrows');

  // await page.waitForNavigation({
  //   waitUntil: 'networkidle0',
  // });

  // await page.$eval('div#mrows', form => form.click());

  //   await page.evaluate(() => {
  //     document.querySelector('#mrows').click();
  // });

  // await Promise.all([
  //   page.$eval(`#mrows`, element =>
  //     element.click()
  //   ),
  //   await page.waitForNavigation(),
  // ]);

  // const myButton = document.querySelector(`div#mrows`);
  // const myButton = await page.$('div#mrows');

  // more_information = await page.waitForSelector('div#mrows');  // can also click on elements!
  // console.log('myButton2222',myButton);
  // // more_information2 = await more_information.waitForSelector('span');  // can also click on elements!
  // await myButton.click();

  // await new Promise(r => setTimeout(r, 2000));

  // const title = await page.evaluate(async () => {
  //   // use selectors to find data you need

  //   const homeTeam = document.querySelector('.homeTeam');
  //   return homeTeam.textContent;
  // });

  // console.log('title2222', title);

  // await browser.close(); // close the browser

  // //VENAS
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
  //           action: 'under25',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim().replace('FC ', ''),
  //           awayTeam:
  //             getHomeTeamName(awayTeam.trim()) !== ''
  //               ? getHomeTeamName(awayTeam.trim())
  //               : awayTeam.trim().replace('FC ', ''),
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //Bettingtips
  

  // betprotips
  // await axios(url_fbp)
  // await axios(url_predutd)
  // .then((response) => {
  //   const html = response.data;
  //   // console.log(response.data);
  //   console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('.bg-white', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     // const homeTeam = $(this).find('.teams').find('.home-team').find('span:nth-child(1)').text();
  //     const homeTeam = $(this).find('a:nth-child(1)').find('div:nth-child(2)').find('div:nth-child(1)').text();
  //     const awayTeam = $(this).find('a:nth-child(1)').find('div:nth-child(2)').find('div:nth-child(2)').text();
  //     const prediction = $(this).find('a:nth-child(1)').find('.bg-warning').text();
  //     console.log('homeTeam000', homeTeam);

  //     // const awayTeam = $(this).find('.teams').find('.away-team').text();
  //     console.log('awayTeam000', awayTeam);
  //     // const prediction = $(this).find('.advice-row').find('div:nth-child(1)').text();
  //     console.log('prediction000', prediction);
  //     // const underYes = prediction.includes('Under 2.5');
  //     // console.log('over25Fbp', underYes);

  //     // homeTeam !== '' &&
  //     // underYes &&
  //     //   under25.push({
  //     //     source: 'betprotips',
  //     //     action: 'under25',
  //     //     checked: false,
  //     //     homeTeam:
  //     //       getHomeTeamName(homeTeam.trim()) !== ''
  //     //         ? getHomeTeamName(homeTeam.trim())
  //     //         : homeTeam.trim().replace('FC ', ''),
  //     //     awayTeam,
  //     //     date: todayString,
  //     //   });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

  // console.log('btts222', btts);

  // //PREDUTD
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

  //       console.log('predutdU25', homeTeam);

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

  //       const scoreTotal = score1 * 1 + score2 * 1;

  //       homeTeam !== '' &&
  //         date.includes(`0${day}.${month}`) &&
  //         scoreTotal <= 1 &&
  //         under25.push({
  //           source: 'vitibet',
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
  //         tip.includes('Under') &&
  //         under25.push({
  //           source: 'soccertipz',
  //           action: 'under25',
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

  // //MINES
  // await axios(url_mines)
  //   .then((response) => {
  //     const data = response.data;
  //     // console.log('minesUnder', data);

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
  //         pred.includes('UNDER') &&
  //         parseInt(percent) > 68 &&
  //         under25.push({
  //           source: 'footsuper',
  //           action: 'under25',
  //           isAcca: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim().replace('FC ', ''),
  //           awayTeam:
  //             getHomeTeamName(awayTeam.trim()) !== ''
  //               ? getHomeTeamName(awayTeam.trim())
  //               : awayTeam.trim().replace('FC ', ''),
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  //PASSION
  // await axios(
  //   `https://passionpredict.com/over-2-5-goals?dt=${year}-${month}-${day}`
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
  //         .find('td:nth-child(3)')
  //         .find('span:first')
  //         .text()
  //         .split(' VS')[0];

  //       let pred = $(this).find('td:nth-child(4)').find('span:first').text();

  //       homeTeam !== '' &&
  //         pred !== '' &&
  //         pred.includes('Under') &&
  //         homeTeamsArr.push({ homeTeam: homeTeam, pred: pred });
  //     });

  //     homeTeamsArr.forEach((elem) => {
  //       elem.homeTeam !== '' &&
  //         elem.pred !== '' &&
  //         elem.pred.includes('Under') &&
  //         under25.push({
  //           source: 'passion',
  //           action: 'under25',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(elem.homeTeam.trim()) !== ''
  //               ? getHomeTeamName(elem.homeTeam.trim())
  //               : elem.homeTeam.trim().replace('FC ', ''),
  //           awayTeam: '',
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

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
  //       // const tip = $(this).find('td:nth-child(4)').text();

  //       homeTeam !== '' &&
  //         under25.push({
  //           source: 'r2bet',
  //           action: 'under35',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim().replace('FC ', ''),
  //           awayTeam:
  //             getHomeTeamName(awayTeam.trim()) !== ''
  //               ? getHomeTeamName(awayTeam.trim())
  //               : awayTeam.trim().replace('FC ', ''),
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

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
  // await axios(url_goalnow)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.goalslink', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       let homeTeam = $(this).find('.goalshome').text();
  //       const awayTeam = $(this).find('.goalsaway').text();
  //       homeTeam = homeTeam.split(awayTeam)[0];
  //       // let homeTeam1 = '';
  //       // if (homeTeam.includes('2.5 Goals')) {
  //       //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
  //       // }

  //       const pred = $(this).find('.goalstip').find('span:first').text();
  //       homeTeam !== '' &&
  //         pred.includes('Under') &&
  //         under25.push({
  //           source: 'goalsnow',
  //           action: 'under25',
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
  // await axios(url_fbpai)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.footgame', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       const isUnderFbpai = $(this).find('.match-tip-show').text();

  //       if (isUnderFbpai === 'Under 2.5') {
  //         const homeTeam = $(this)
  //           .find('a:first')
  //           .attr('title')
  //           .split(' - ')[0];
  //         const awayTeam = $(this)
  //           .find('a:first')
  //           .attr('title')
  //           .split(' - ')[1];
  //         homeTeam !== '' &&
  //           under25.push({
  //             source: 'fbpai',
  //             action: 'under25',
  //             checked: false,
  //             homeTeam:
  //               getHomeTeamName(homeTeam.trim()) !== ''
  //                 ? getHomeTeamName(homeTeam.trim())
  //                 : homeTeam.trim().replace('FC ', ''),
  //             awayTeam,
  //             date: todayString,
  //           });
  //       }
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));
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
  //           source: 'fbp',
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
  //       const under25Yes = under25text === 'Under';
  //       // console.log('over25Mybets', over25);

  //       // if (homeTeam.trim() === 'Accrington ST') {
  //       //   console.log('over25 HT', getHomeTeamName(homeTeam.trim()))
  //       // };

  //       homeTeam !== '' &&
  //         under25Yes &&
  //         under25.push({
  //           source: 'mybets',
  //           action: 'under25',
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

  // let start = 0;
  // let next = 1;
  // let sortedUnder = under25.sort((a, b) => {
  //   if (a.homeTeam < b.homeTeam) {
  //     return -1;
  //   }
  //   if (a.homeTeam > b.homeTeam) {
  //     return 1;
  //   }
  //   return 0;
  // });

  // //удаление дублей
  // while (next < sortedUnder.length) {
  //   if (
  //     sortedUnder[start].homeTeam.trim() === sortedUnder[next].homeTeam.trim()
  //   ) {
  //     if (
  //       sortedUnder[start].action === sortedUnder[next].action &&
  //       sortedUnder[start].source === sortedUnder[next].source
  //     ) {
  //       sortedUnder.splice(next, 1);
  //     }
  //   }

  //   start++;
  //   next++;
  // }

  // mongoose.connect(
  //   'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
  //   {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   }
  // );

  // await Under25.insertMany(sortedUnder)
  //   .then(function () {
  //     console.log('Under inserted'); // Success
  //   })
  //   .catch(function (error) {
  //     console.log(error); // Failure
  //   });

  // await db.disconnect();
  // res.send('under loaded');
});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = underRouter;
