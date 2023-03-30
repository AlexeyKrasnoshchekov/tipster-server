const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeUnder25 = async function (under25) {
  const url_goalnow = 'https://www.goalsnow.com/over-under-predictions/';
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

  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();
  const todayString = formattedToday.toString();
  const year = today.getFullYear();
  const day = today.getDate();
  let month = today.getMonth();
  month = month < 10 ? `0${month + 1}` : month + 1;

  //PASSION
  await axios(
    `https://passionpredict.com/over-2-5-goals?dt=${year}-${month}-${day}`
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
        // const pred = $(this).find('td:nth-child(4)').find('span:first').text();
        // const awayTeam = $(this).find('tr').find('td:nth-child(3)').find('span:first').text().split(' "" ')[1].split(' VS')[1];
        // const awayTeam = $(this).find('.mtl-index-page-matches__name').text().split(' vs ')[1];
        // const predicDate = $(this).find('.mtl-index-page-matches__date').find('p:first').find('time:first').text();
        // console.log('homeTeamPass', homeTeam);
        homeTeam !== '' &&
        pred !== '' &&
        pred.includes('Under') &&
        homeTeamsArr.push({ homeTeam: homeTeam, pred: pred });
      });

      // console.log('homeTeamsArr', homeTeamsArr);
      // homeTeamsArr.splice(0, 1);
      // console.log('homeTeamsArr111', homeTeamsArr);
      // let indexOfEmpty = homeTeamsArr.indexOf('');
      // console.log('indexOfEmpty', indexOfEmpty);
      // let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
      // console.log('todayHomeTeamsArr', todayHomeTeamsArr);
      homeTeamsArr.forEach((elem) => {
        elem.homeTeam !== '' && elem.pred !== '' && elem.pred.includes('Under') &&
          under25.push({
            source: 'passion',
            action: 'under25',
            checked: false,
            homeTeam:
              getHomeTeamName(elem.homeTeam.trim()) !== ''
                ? getHomeTeamName(elem.homeTeam.trim())
                : elem.homeTeam.trim(),
            awayTeam: '',
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
            source: 'goalsnow',
            action: 'under25',
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
              source: 'fbpai',
              action: 'under25',
              checked: false,
              homeTeam:
                getHomeTeamName(homeTeam.trim()) !== ''
                  ? getHomeTeamName(homeTeam.trim())
                  : homeTeam.trim(),
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

  //FBP
  // await axios(url_fbp)
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
          under25.push({
            source: 'fbp',
            action: 'under25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam,
            date: todayString,
            predictionDate: predictionDate,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));
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
            source: 'mybets',
            action: 'under25',
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
};

module.exports = { scrapeUnder25 };
