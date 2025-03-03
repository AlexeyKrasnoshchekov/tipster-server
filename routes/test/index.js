// require express and it's router component
const express = require('express');
const { ProxyCrawlAPI } = require('proxycrawl');
const api1 = new ProxyCrawlAPI({ token: 'Gd1m4tJ4uYlAgJYBEmMvXw' });
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
// const { CheckerO, CheckerU} = require('../../mongo_schema/Checkers');
const { Under25 } = require('../../mongo_schema/Under25');
const { Btts } = require('../../mongo_schema/Btts');
const { WinData } = require('../../mongo_schema/WinDataModel');
const { Over } = require('../../mongo_schema/Over');
const { correctScore } = require('../../mongo_schema/CorrectScore');

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

const url_fbp365_cs =
  'https://www.footballsuper.tips/todays-correct-score-football-super-tips/';

const url_betclan = 'https://www.betclan.com/accumulator-tips-for-today/';
const url_fbp365 = 'https://footballprediction365.com/win-treble-tips';

// const url_predictz = 'https://www.predictz.com/predictions/today/correct-score/';

const url_betshoot_o25 =
  'https://www.betshoot.com/football/over-25-goals-tips/';
const url_betshoot_btts =
  'https://www.betshoot.com/football/both-teams-to-score-tips/';
const url_goalnow =
  'https://www.goalsnow.com/accumulator-btts-both-teams-to-score/';
const url_hostpredict =
  'https://hostpredict.com/over-3-5-goals';
  const url_venasbet35 = 'https://venasbet.com/over_3_5_goals';
  const url_goalie = 'https://ai-goalie.com/';
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
const url_kickoff = `https://www.kickoff.co.uk/predictions/over-under-0-5-goals/`;
// const url_wininbets = 'https://wininbets.com/under-over-predictions';
const url_scorepredictor = 'https://scorepredictor.net/index.php?section=football';
const url_bettingclosed = `https://www.bettingclosed.com/predictions/date-matches/${year}-${month1}-${day1}/bet-type/correct-scores`;
// const url_betwizad = 'https://betwizad.com/predictions';
const url_betwizad = `https://betwizad.com/predictions?date=${year}-${month1}-${day1}`;

const url_bigfree = 'https://bigfreetips.com/sure-bets-today/';
const url_kingspredict = 'https://kingspredict.com/Double_chance';
const url_victorspredict = 'https://victorspredict.com/store/draws';
const url_fbp2 = 'https://footballpredictions.com/footballpredictions/';
const url_gnow_accum = 'https://www.goalsnow.com/accumulator-over-2.5-goals/';

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
const url_betimate_tennis = `https://betimate.com/en/tennis-predictions?date=${year}-${month1}-${day1}`;
// const url_stats24 = `https://www.stats24.com/football/matches/${year}-${month1}-${day1}`;
// require the middlewares and callback functions from the controller directory
// const { create, read, removeTodo } = require('../controller');

const url_predictz = 'https://www.predictz.com/predictions/today/correct-score/';
const url_bettingtips_cs =
  'https://www.bettingtips.today/correct-score-predictions-tips/';
const predictzData = [];
const alldata = [];


underRouter.get('/loadPz', cors(corsOptions), async (req, res) => {
  console.log('test111', req.query.date);
  let correctScoreArr = [];

    await api1
    .get(url_predictz)
    .then((response) => {
  if (response.statusCode === 200 && response.originalStatus === 200) {
    // console.log('000', response.body);
    const html = response.body;
    // console.log(response.data);
    console.log('000', html);
        const $ = cheerio.load(html);

        $('.pttr', html).each(function () {
          //<-- cannot be a function expression
          // const title = $(this).text();
          const homeTeam = $(this).find('.ptmobh').text();
          const awayTeam = $(this).find('.ptmoba').text();
          // const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];
    
          const score = $(this).find('.ptpredboxsml').text();
          let score1 = score.split('-')[0];
          score1 = score1.split(' ')[1];
          const score2 = score.split('-')[1];
    
          // console.log('homeTeam', homeTeam);
          // console.log('awayTeam', awayTeam);
          // console.log('score', score);
          
          
          // const isDraw = score1 * 1 === score2 * 1;
          // const homeScore = score1 > 0;
          // const awayScore = score2 > 0;
    
          // const bttsYes = homeScore && awayScore;
          const scoreTotal = score1 && score2 && Number(score1*1 + score2*1);
          // const win1 = score1 * 1 > score2 * 1;
          // const win2 = score1 * 1 < score2 * 1;
    
          
          
          homeTeam !== '' && !isNaN(scoreTotal) && score1 !== '' && score2 !== '' &&
          correctScoreArr.push({
            source: 'predictz_cs',
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
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }

      // res.send('bettingtips crawl loaded');
    })
    .catch((err) => console.log(err));

  //    await api1
  // .get(url_bettingtips_cs)
  // .then((response) => {
  //   if (response.statusCode === 200 && response.originalStatus === 200) {
  //     // console.log('000', response.body);
  //     const html = response.body;
  //     const $ = cheerio.load(html);

  //     $('.drow', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[0];
  //       const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];
  
  //       const score = $(this).find('.col-7').find('.leftbar').find('div:nth-child(6)').text();
  //       const score1 = score.split('-')[0];
  //       const score2 = score.split('-')[1];

  //       const scoreTotal = score1 && score2 && Number(score1*1 + score2*1);
        
  
  //       homeTeam !== '' && !isNaN(scoreTotal) && score1 !== '' && score2 !== '' &&
  //       correctScoreArr.push({
  //         source: 'bettingtips_cs',
  //         score: `${score1}-${score2}`,
  //         total: scoreTotal,
  //         homeTeam: homeTeam.trim(),
  //         awayTeam: awayTeam.trim(),
  //         date: req.query.date,
  //         homeTeamWin: score1*1 > score2*1 ? 'true' : 'false',
  //         draw: score1*1 === score2*1 ? 'true' : 'false',
  //         awayTeamWin: score1*1 < score2*1 ? 'true' : 'false'
  //       });
  
     
  //     });

  //   } else {
  //     console.log('Failed: ', response.statusCode, response.originalStatus);
  //   }

  //   // res.send('bettingtips crawl loaded');
  // })
  // .catch((err) => console.log(err));

  // await api1
  //   .get(url_stats24)
  //   .then((response) => {
  // if (response.statusCode === 200 && response.originalStatus === 200) {
  //   // console.log('000', response.body);
  //   const html = response.body;
  //   // console.log(response.data);
  //   console.log('000', html);
  //       const $ = cheerio.load(html);

  //       $('.sts_cont_list_row_tbody', html).each(function () {
  //         //<-- cannot be a function expression
  //         // const title = $(this).text();
  //         // const homeTeam = $(this).find('.sts_cont_list_market').find('p:nth-child(1)').find('a:nth-child(1)').text();
  //         const homeTeam = $(this).find('.sts_cont_list_matches_name').find('div:nth-child(1)').find('p:nth-child(1)').text();
  //         // const homeTeam = $(this).find('.sts_cont_list_matches').find('div:nth-child(1)').find('a:nth-child(1)').find('.sts_cont_list_matches_name').find('div:nth-child(1)').find('p:nth-child(1)').text();
  //         // const awayTeam = $(this).find('.sts_cont_list_matches').find('div:nth-child(1)').find('a:nth-child(1)').find('.sts_cont_list_matches_name').find('div:nth-child(2)').find('p:nth-child(1)').text();
  //         // const market = $(this).find('.sts_cont_list_market').find('p:nth-child(1)').find('a:nth-child(1)').text();
  //         // const prob = $(this).find('.sts_cont_list_prob').find('div:nth-child(1)').find('div:nth-child(1)').text();
  //         // const awayTeam = $(this).find('.ptmoba').text();
  //         // const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];
    
  //         // const score = $(this).find('.ptpredboxsml').text();
  //         // let score1 = score.split('-')[0];
  //         // score1 = score1.split(' ')[1];
  //         // const score2 = score.split('-')[1];
    
  //         console.log('homeTeam', homeTeam);
  //         // console.log('awayTeam', awayTeam);
  //         // console.log('market', market);
  //         // console.log('prob', prob);
          
          
  //         // const isDraw = score1 * 1 === score2 * 1;
  //         // const homeScore = score1 > 0;
  //         // const awayScore = score2 > 0;
    
  //         // const bttsYes = homeScore && awayScore;
  //         // const scoreTotal = score1 * 1 + score2 * 1;
  //         // const win1 = score1 * 1 > score2 * 1;
  //         // const win2 = score1 * 1 < score2 * 1;
    
          
          
  //         // homeTeam !== '' &&
  //         // predictzData.push({
  //         //       source: 'predictz_btts',
  //         //       action: bttsYes ? 'btts' : 'btts no',
  //         //       isAcca: false,
  //         //       homeTeam: homeTeam.trim(),
  //         //       awayTeam: awayTeam.trim(),
  //         //       date: req.query.date,
  //         //     });
  //         //   homeTeam !== '' &&
  //         //     isDraw &&
  //         //     predictzData.push({
  //         //       source: 'predictz_draw',
  //         //       action: 'draws',
  //         //       isAcca: false,
  //         //       homeTeam: homeTeam.trim(),
  //         //       awayTeam: awayTeam.trim(),
  //         //       date: req.query.date,
  //         //     });
  //         //     if (scoreTotal >= 3) {
  //         //       homeTeam !== '' &&
  //         //       predictzData.push({
  //         //           source: 'predictz_o25',
  //         //           action: 'over25',
  //         //           checked: false,
  //         //           homeTeam: homeTeam.trim(),
  //         //           awayTeam: awayTeam.trim(),
  //         //           date: req.query.date,
  //         //         });
  //         //     }
  //         //     if (scoreTotal <= 2) {
  //         //       homeTeam !== '' &&
  //         //       predictzData.push({
  //         //           source: 'predictz_u25',
  //         //           action: 'under25',
  //         //           isAcca: false,
  //         //           homeTeam: homeTeam.trim(),
  //         //           awayTeam: awayTeam.trim(),
  //         //           date: req.query.date,
  //         //         });
  //         //     }
  //         //     if (win1 || win2) {
  //         //       homeTeam !== '' &&
  //         //       predictzData.push({
  //         //           source: 'predictz_win',
  //         //           action: 'win',
  //         //           checked: false,
  //         //           homeTeam: homeTeam.trim(),
  //         //           awayTeam: awayTeam.trim(),
  //         //           date: req.query.date,
  //         //           prediction: win1 ? homeTeam.trim() : awayTeam.trim(),
  //         //         });
  //         //     }
       
  //       });
  //     } else {
  //       console.log('Failed: ', response.statusCode, response.originalStatus);
  //     }

  //     // res.send('bettingtips crawl loaded');
  //   })
  //   .catch((err) => console.log(err));

    // console.log('btts', btts);

    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  
    // const bttsDataCrawl = predictzData.filter((item) => item.action.includes('btts'));
    // console.log('bttsDataCrawl', bttsDataCrawl);
    // await Btts.insertMany(bttsDataCrawl)
    //   .then(function () {
    //     console.log('crawl Btts inserted'); // Success
    //   })
    //   .catch(function (error) {
    //     console.log(error); // Failure
    //   });

  

  
    // const underDataCrawl = predictzData.filter((item) => item.action === 'under25');
    // console.log('underDataCrawl', underDataCrawl);
    // await Under25.insertMany(underDataCrawl)
    //   .then(function () {
    //     console.log('crawl Under inserted'); // Success
    //   })
    //   .catch(function (error) {
    //     console.log(error); // Failure
    //   });
  
    //   const winDataCrawl = predictzData.filter((item) => item.action === 'win');
    //   console.log('winDataCrawl', winDataCrawl);
    //   await WinData.insertMany(winDataCrawl)
    //     .then(function () {
    //       console.log('winDataCrawl inserted'); // Success
    //     })
    //     .catch(function (error) {
    //       console.log(error); // Failure
    //     });
  
    await correctScore.insertMany(correctScoreArr)
      .then(function () {
        console.log('correctScore inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

  await db.disconnect();
  // res.send(correctScoreArr);
    res.send('crawl loaded');

   
});
underRouter.get('/loadTest', cors(corsOptions), async (req, res) => {

  let correctScoreArr = [];

  await api1
  .get(url_bettingtips_cs)
  .then((response) => {
    if (response.statusCode === 200 && response.originalStatus === 200) {
      // console.log('000', response.body);
      const html = response.body;
      // console.log('111', html);
      const $ = cheerio.load(html);
      
      $('.fullgame', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();

        // const homeTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[0];
        // const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];
        const homeTeam = $(this).find('.dividehome').find('.teamtip').text();
        const awayTeam = $(this).find('.divideaway').find('.teamtip').text();
  
        const score = $(this).find('.diveachgame').find('.icontip').find('.spantip').text();
        const score1 = score.split(':')[0];
        const score2 = score.split(':')[1];

        const scoreTotal = score1 && score2 && Number(score1*1 + score2*1);

        // console.log('111', homeTeam);
        
  
        homeTeam !== '' && !isNaN(scoreTotal) && score1 !== '' && score2 !== '' &&
        correctScoreArr.push({
          source: 'bettingtips_cs',
          score: `${score1}-${score2}`,
          total: scoreTotal,
          homeTeam: homeTeam.trim(),
          awayTeam: awayTeam.trim(),
          date: todayString,
          homeTeamWin: score1*1 > score2*1 ? 'true' : 'false',
          draw: score1*1 === score2*1 ? 'true' : 'false',
          awayTeamWin: score1*1 < score2*1 ? 'true' : 'false'
        });
  
     
      });

    } else {
      console.log('Failed: ', response.statusCode, response.originalStatus);
    }

    // res.send('bettingtips crawl loaded');
  })
  .catch((err) => console.log(err));

  console.log('correctScoreArr',correctScoreArr);

  //venasbet35
  // await axios(url_venasbet35)
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
  //         alldata.push({
  //           source: 'venas_o35',
  //           action: 'over35',
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

  // //hostpredict
  // await axios(url_hostpredict)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   // const body = $('section:nth-child(2) tbody', html);

  //   $('tr', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam1 = $(this).find('td:nth-child(3)').text().split(' VS ')[0];
  //     const homeTeam = homeTeam1.split(' VS')[0];
  //     // const homeTeam1 = $(this).find('td').text().split(' VS ')[0];
  //     const awayTeam = $(this).find('td:nth-child(3)').text().split(`VS`)[1];
  //     console.log('homeTeam777',homeTeam);
  //     // console.log('homeTeam777888',homeTeam1);
  //     console.log('awayTeam777',awayTeam);
  //     // const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];

  //     homeTeam !== '' &&
  //         alldata.push({
  //           source: 'hostpredict_o35',
  //           action: 'over35',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim(),
  //           awayTeam: awayTeam,
  //           date: todayString,
  //         });

   
  //   });

  //   // res.send('hello over loaded');
  // })
  // .catch((err) => console.log(err));

  // console.log('alldata',alldata);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await correctScore.insertMany(correctScoreArr)
    .then(function () {
      console.log('cs data inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
  res.send('crawl loaded');
  
});

underRouter.get('/loadWizad', cors(corsOptions), async (req, res) => {
  console.log('test111');

  //betwizad
  await axios(url_goalie)
  .then((response) => {
    const html = response.data;

    // console.log('000', html);
    const $ = cheerio.load(html);

    // const body = $('section:nth-child(2) tbody', html);

    $('tr', html).each(function () {
      //<-- cannot be a function expression
      // const title = $(this).text();
      const homeTeam = $(this).find('.team').find('.home-team').text();
      console.log('homeTeam888',homeTeam);
      // const awayTeam = $(this).find('.teadms').find('.teamd').text().replace(/\r?\n/, '').replace(/\r?\n/, '').replace(/\r?\n/, '').split('                            ')[1];

      // const score = $(this).find('.col-7').find('.leftbar').find('div:nth-child(6)').text();
      // const score1 = score.split('-')[0];
      // const score2 = score.split('-')[1];
      
      
      // const isDraw = score1 * 1 === score2 * 1;
      // const homeScore = score1 > 0;
      // const awayScore = score2 > 0;

      // const bttsYes = homeScore && awayScore;
      // const scoreTotal = score1 * 1 + score2 * 1;
      // const win1 = score1 * 1 > score2 * 1;
      // const win2 = score1 * 1 < score2 * 1;

      // homeTeam !== '' && score1 !== '' && score2 !== '' && correctScoreArr.push({
      //   source: 'betwizad_cs',
      //   score: `${score1}-${score2}`,
      //   homeTeam: homeTeam.trim(),
      //   awayTeam: awayTeam.trim(),
      //   date: todayString,
      // });

      // console.log('homeTeam', homeTeam.trim());
      // console.log('awayTeam', awayTeam.trim());
      // console.log('cs', cs);
      
      // homeTeam !== '' &&
      //     wininData.push({
      //       source: 'betwizad_btts',
      //       action: bttsYes ? 'btts' : 'btts no',
      //       isAcca: false,
      //       homeTeam: homeTeam.trim(),
      //       awayTeam: awayTeam.trim(),
      //       date: req.query.date,
      //     });

      //     if (scoreTotal <= 2) {
      //       homeTeam !== '' &&
      //       wininData.push({
      //           source: 'betwizad_u25',
      //           action: 'under25',
      //           isAcca: false,
      //           homeTeam: homeTeam.trim(),
      //           awayTeam: awayTeam.trim(),
      //           date: req.query.date,
      //         });
      //     }
      //     if (win1 || win2) {
      //       homeTeam !== '' &&
      //       wininData.push({
      //           source: 'betwizad_win',
      //           action: 'win',
      //           checked: false,
      //           homeTeam: homeTeam.trim(),
      //           awayTeam: awayTeam.trim(),
      //           date: req.query.date,
      //           prediction: win1 ? homeTeam.trim() : awayTeam.trim(),
      //         });
      //     }
   
    });

    // res.send('hello over loaded');
  })
  .catch((err) => console.log(err));


    // console.log('wininData', wininData);

    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  
    const bttsDataCrawl = wininData.filter((item) => item.action.includes('btts'));
    console.log('bttsDataCrawl', bttsDataCrawl);
    await Btts.insertMany(bttsDataCrawl)
      .then(function () {
        console.log('crawl Btts inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

  

  
    const underDataCrawl = wininData.filter((item) => item.action === 'under25');
    console.log('underDataCrawl', underDataCrawl);
    await Under25.insertMany(underDataCrawl)
      .then(function () {
        console.log('crawl Under inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  
      const winDataCrawl = wininData.filter((item) => item.action === 'win');
      console.log('winDataCrawl', winDataCrawl);
      await WinData.insertMany(winDataCrawl)
        .then(function () {
          console.log('winDataCrawl inserted'); // Success
        })
        .catch(function (error) {
          console.log(error); // Failure
        });
  
    await db.disconnect();
    res.send('crawl loaded');

});
// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = underRouter;
