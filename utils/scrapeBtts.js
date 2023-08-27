const axios = require('axios');
const cheerio = require('cheerio');
// const { ProxyCrawlAPI } = require('proxycrawl');
// const api1 = new ProxyCrawlAPI({ token: 'IpErJSu5VcdhkKqgLRJiwQ' });
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeBtts = async function (btts) {
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
  month = month < 10 ? `0${month + 1}` : month + 1;

  const url_fbp =
    'https://footballpredictions.net/btts-tips-both-teams-to-score-predictions';
  const url_accum = 'https://footyaccumulators.com/football-tips/btts';
  const url_fst = 'https://www.freesupertips.com/both-teams-to-score-tips/';
  const url_footy = 'https://footystats.org/predictions/btts';
  // const url_bettingtips = 'https://www.bettingtips.today/football-accumulators-tips/';
  // const url_soccertipz = 'https://www.soccertipz.com/both-teams-to-score/';
  const url_banker = 'https://bankerpredict.com/both-team-to-score';
  // const url_venasbet = 'https://venasbet.com/btts_gg';
  const url_r2bet = 'https://r2bet.com/gg_btts';
  const url_hello = 'https://hellopredict.com/btts';
  // const url_nvtips = 'https://nvtips.com/ru/';
  const url_prot = 'https://www.protipster.com/betting-tips/btts';
  const url_footsuper =
    'https://www.footballsuper.tips/todays-both-teams-to-score-football-super-tips/';
  const url_footsuper_btts =
    'https://www.footballsuper.tips/football-accumulators-tips/football-tips-both-teams-to-score-accumulator/';

  // const url_mighty = 'https://www.mightytips.com/football-predictions/btts/';
  // const url_wdw = 'https://www.windrawwin.com/accumulator-tips/today/';
  // const url_mybets =
  //   'https://www.mybets.today/soccer-predictions/both-teams-to-score-predictions/';
  // const url_fbpai =
  //   'https://footballpredictions.ai/football-predictions/btts-predictions/';
  const url_goalnow =
    'https://www.goalsnow.com/accumulator-btts-both-teams-to-score/';
  // const url_gnow_accum =
  //   'https://www.goalsnow.com/accumulator-btts-both-teams-to-score/';
  const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-08-${day}T00:00:00Z&to=2023-08-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=GG&leagueIds=`;

  const timeout = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  //FBP
  // (async () => {
  //   // Initiate the browser
  //   const browser = await puppeteer.launch({
  //     headless: false, // Show the browser.
  //   });

  //   // Create a new page with the default browser context
  //   const page = await browser.newPage();

  //   // Setting page view
  //   await page.setViewport({ width: 1280, height: 720 });

  //   // Go to the target website
  //   await page.goto(url_fbp);

  //   // await page
  //   // .waitForSelector('match-preview')
  //   // .then(() => );

  //   // Wait for security check
  //   // await page.waitForTimeout(3000);
  //   // await timeout(5000);

  //   await page.waitForSelector('.match-preview').then(async () => {
  //     console.log('first', page.url);
  //     // SCRAPE
  //     await axios(page.url)
  //       .then((response) => {
  //         const html = response.data;
  //         // console.log(response.data);
  //         // console.log('000', response);
  //         const $ = cheerio.load(html);

  //         $('.match-preview', html).each(function () {
  //           //<-- cannot be a function expression
  //           // const title = $(this).text();
  //           const homeTeam = $(this)
  //             .find('.home-team')
  //             .find('.team-label')
  //             .text();
  //           const awayTeam = $(this)
  //             .find('.away-team')
  //             .find('.team-label')
  //             .text();
  //           const predictionDate = $(this)
  //             .find('.match-preview-date')
  //             .find('.full-cloak')
  //             .text();
  //           console.log('first', {
  //             source: 'fbp',
  //             action: 'btts',
  //             checked: false,
  //             homeTeam: homeTeam.trim(),
  //             awayTeam,
  //             date: todayString,
  //             predictionDate: predictionDate,
  //           });
  //           homeTeam !== '' &&
  //             btts.push({
  //               source: 'fbp',
  //               action: 'btts',
  //               checked: false,
  //               homeTeam: homeTeam.trim(),
  //               awayTeam,
  //               date: todayString,
  //               predictionDate: predictionDate,
  //             });
  //         });

  //         // res.json(btts);
  //       })
  //       .catch((err) => console.log(err));
  //   });

  //   // Closes the browser and all of its pages
  //   await browser.close();
  // })();

  //Bettingtips
  // await api1.get(url_bettingtips)
  // .then((response) => {

  //   if (response.statusCode === 200 && response.originalStatus === 200) {
  //     // console.log('000', response.body);
  //     const html = response.body;
  //     const $ = cheerio.load(html);

  //     $('.diveachgame', html).each(function () {
  //       const pred = $(this).find('.icontip').find('span:first').text();

  //         const homeTeam = $(this).find('.dividehome').find('div:first').find('.teamtip').text();
  //         const awayTeam = $(this).find('.divideaway').find('div:first').find('.teamtip').text();

  //         homeTeam !== '' && pred.includes('Yes') &&
  //           btts.push({
  //             source: 'bettingtips',
  //             action: 'btts',
  //             isAcca: true,
  //             homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //             awayTeam,
  //             date: todayString,
  //           });
  //     });

  //   } else {
  //     console.log('Failed: ', response.statusCode, response.originalStatus);
  //   }

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

  //Mines
  await axios(url_mines)
    .then((response) => {
      const data = response.data;

      data.forEach((elem) => {
        elem !== '' && elem.bestOddProbability > 79 &&
          btts.push({
            source: 'mines',
            action: `${elem.bestOdd} ${elem.bestOddProbability}%`,
            homeTeam: elem.localTeam.name,
            awayTeam: elem.visitorTeam.name,
            date: todayString,
            isAcca: false,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  //SOCCERTIPZ
  // await axios(url_soccertipz)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('tr', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this).find('td:nth-child(2)').text().split(/\r?\n/)[0];
  //     const awayTeam = $(this).find('td:nth-child(2)').text().split(/\r?\n/)[1];

  //     const tip = $(this).find('td:nth-child(3)').text();

  //     homeTeam &&
  //     homeTeam !== '' &&
  //     awayTeam &&
  //     awayTeam !== '' &&
  //     tip.includes('YES') &&
  //     btts.push({
  //         source: 'soccertipz',
  //         action: 'btts',
  //         checked: false,
  //         homeTeam:
  //           getHomeTeamName(homeTeam.trim()) !== ''
  //             ? getHomeTeamName(homeTeam.trim())
  //             : homeTeam.trim(),
  //         awayTeam: getHomeTeamName(awayTeam.trim()) !== ''
  //         ? getHomeTeamName(awayTeam.trim())
  //         : awayTeam.trim(),
  //         date: todayString,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

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
            source: 'banker',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //Goalnow
  // await axios(url_goalnow)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('.accasdisplay', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     let homeTeam = $(this)
  //       .find('.row3:first')
  //       .find('.whitespace')
  //       .text();
  //     const other = $(this).find('.row3:first').find('.whitespace').find('.tooltiptext').text();
  //     homeTeam = homeTeam && homeTeam !== '' && homeTeam.includes(other) && homeTeam.replace(other, '');

  //     const pred = $(this)
  //       .find('.row4')
  //       .find('span:first')
  //       .text();
  //     homeTeam !== '' && pred.includes('Yes') &&
  //     btts.push({
  //         source: 'gnowAcc',
  //         action: 'btts',
  //         checked: false,
  //         homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //         awayTeam:'',
  //         date: todayString,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

  //GoalnowAccum
  // await axios(url_gnow_accum)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.accasdisplay', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this).find('.row3:first').find('.whitespace').text();
  //       // let homeTeam1 = '';
  //       // if (homeTeam.includes('2.5 Goals')) {
  //       //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
  //       // }
  //       // const awayTeam = $(this)
  //       //   .find('.goalsaway')
  //       //   .text();
  //       const pred = $(this).find('.row4').find('span:first').text();
  //       homeTeam !== '' &&
  //         pred.includes('Yes') &&
  //         btts.push({
  //           source: 'gnowAcc',
  //           action: 'btts',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim(),
  //           awayTeam: '',
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
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
        const homeTeam = teams.split(' VS ')[0];
        const awayTeam = teams.split(' VS ')[1];

        homeTeam !== '' &&
          btts.push({
            source: 'prot',
            action: 'btts',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //FOOTSUPER
  // await axios(url_footsuper)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('.pool_list_item', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this).find('.homedisp').text();
  //     const awayTeam = $(this).find('.awaydisp').text();

  //     const pred = $(this).find('.prediresults').text();
  //     const percent = $(this).find('.biggestpercen').text();

  //     homeTeam !== '' && pred.includes('YES') && parseInt(percent) > 74 &&
  //     btts.push({
  //         source: 'footsuper',
  //         action: 'btts',
  //         isAcca: false,
  //         homeTeam:
  //           getHomeTeamName(homeTeam.trim()) !== ''
  //             ? getHomeTeamName(homeTeam.trim())
  //             : homeTeam.trim(),
  //         awayTeam: getHomeTeamName(awayTeam.trim()) !== ''
  //         ? getHomeTeamName(awayTeam.trim())
  //         : awayTeam.trim(),
  //         date: todayString,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

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
            source: 'footsuper_btts',
            action: 'btts',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

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
  //       const bttsYes = $(this)
  //         .find('td:nth-child(14)')
  //         .find('strong:first')
  //         .text();

  //       // const awayTeam = $(this).find('tr').find('td:nth-child(3)').find('span:first').text().split(' "" ')[1].split(' VS')[1];
  //       // const awayTeam = $(this).find('.mtl-index-page-matches__name').text().split(' vs ')[1];
  //       // const predicDate = $(this).find('.mtl-index-page-matches__date').find('p:first').find('time:first').text();
  //       // console.log('homeTeamPass', homeTeam);
  //       if (bttsYes === 'Да') {
  //         homeTeamsArr.push(homeTeam);
  //       }
  //     });
  //     // console.log('homeTeamsArr', homeTeamsArr);
  //     homeTeamsArr.splice(0, 1);
  //     console.log('homeTeamsArr111', homeTeamsArr);
  //     let indexOfEmpty = homeTeamsArr.indexOf('');
  //     // console.log('indexOfEmpty', indexOfEmpty);
  //     let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
  //     // console.log('todayHomeTeamsArr', todayHomeTeamsArr);
  //     todayHomeTeamsArr.forEach((elem) => {
  //       elem !== '' &&
  //         btts.push({
  //           source: 'nvtips',
  //           action: 'btts',
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

  //WDW
  // await axios(url_wdw)
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
  //     homeTeam !== '' && pred.includes('Yes') &&
  //     btts.push({
  //         source: 'goalsnow',
  //         action: 'btts',
  //         checked: false,
  //         homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //         awayTeam:'',
  //         date: todayString,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

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
        const awayTeam = teams.includes('vs') && teams.split('vs')[1];

        homeTeam !== '' &&
          btts.push({
            source: 'fbp',
            action: 'btts',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: todayString,
            // predictionDate: predictionDate,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  // MIGHTY
  // await axios(url_mighty)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.mtl-index-page-matches__item', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('.mtl-index-page-matches__name')
  //         .text()
  //         .split(' vs ')[0];
  //       const awayTeam = $(this)
  //         .find('.mtl-index-page-matches__name')
  //         .text()
  //         .split(' vs ')[1];
  //       const predicDate = $(this)
  //         .find('.mtl-index-page-matches__date')
  //         .find('p:first')
  //         .find('time:first')
  //         .text();

  //         if (homeTeam.trim() === 'Accrington ST') {
  //           console.log('btts HT', getHomeTeamName(homeTeam.trim()))
  //         };

  //       todayString.includes(predicDate) &&
  //         homeTeam !== '' &&
  //         btts.push({
  //           source: 'mighty',
  //           action: 'btts',
  //           checked: false,
  //           homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));
  // //PASSION
  // await axios(
  //   `https://passionpredict.com/both-team-to-score?dt=${year}-${month}-${day}`
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
  //       // const awayTeam = $(this).find('tr').find('td:nth-child(3)').find('span:first').text().split(' "" ')[1].split(' VS')[1];
  //       // const awayTeam = $(this).find('.mtl-index-page-matches__name').text().split(' vs ')[1];
  //       // const predicDate = $(this).find('.mtl-index-page-matches__date').find('p:first').find('time:first').text();
  //       // console.log('homeTeamPass', homeTeam);
  //       homeTeamsArr.push(homeTeam);
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
  //         btts.push({
  //           source: 'passion',
  //           action: 'btts',
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
  // // MYBETS
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
  //       const bttsYes = $(this).find('.tipdiv').find('span:first').text();

  //       bttsYes === 'Yes' &&
  //         homeTeam !== '' &&
  //         btts.push({
  //           source: 'mybets',
  //           action: 'btts',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim(),
  //           awayTeam,
  //           date: todayString,
  //         });
  //     });

  //     // res.json(btts);
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
        if (homeTeam.includes('Yes')) {
          homeTeam1 = homeTeam.split('BTTS Yes ')[1];
        }
        const awayTeam = $(this)
          .find('.betHeaderTitle')
          .text()
          .split(' vs ')[1];

        // console.log('homeTeam1', homeTeam1);

        let odds = $(this).find('.betHeaderMeta').text();

        const result = $(this).find('.betHeaderMeta').find('.result').text();

        odds =
          odds &&
          odds !== '' &&
          odds.includes(result) &&
          odds.replace(result, '');

        homeTeam1 !== '' &&
          parseInt(odds) < 1.7 &&
          btts.push({
            source: 'footy',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam1.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(btts);
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
  //         btts.push({
  //           source: 'venas',
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
            source: 'r2bet',
            action: 'btts',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //hello
  // await axios(url_hello)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('tr', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this).find('.tab_b_match').find('span:first').text().split('VS')[0];
  //     const awayTeam = $(this).find('.tab_b_match').find('span:first').text().split('VS')[1];

  //     // const awayTeam = $(this).find('td:nth-child(3)').text().split('VS')[1];
  //     // const tip = $(this).find('td:nth-child(4)').text();

  //     homeTeam !== '' &&
  //     btts.push({
  //         source: 'hello',
  //         action: 'btts',
  //         checked: false,
  //         homeTeam:
  //           getHomeTeamName(homeTeam.trim()) !== ''
  //             ? getHomeTeamName(homeTeam.trim())
  //             : homeTeam.trim(),
  //         awayTeam: getHomeTeamName(awayTeam.trim()) !== ''
  //         ? getHomeTeamName(awayTeam.trim())
  //         : awayTeam.trim(),
  //         date: todayString,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));
  // //Fbpai
  // await axios(url_fbpai)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.footgame', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       const isBttsFbpai = $(this).find('.match-tip-show').text();

  //       if (isBttsFbpai === 'Yes') {
  //         const homeTeam = $(this)
  //           .find('a:first')
  //           .attr('title')
  //           .split(' - ')[0];
  //         const awayTeam = $(this)
  //           .find('a:first')
  //           .attr('title')
  //           .split(' - ')[1];

  //         homeTeam !== '' &&
  //           btts.push({
  //             source: 'fbpai',
  //             action: 'btts',
  //             checked: false,
  //             homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //             awayTeam,
  //             date: todayString,
  //           });
  //       }
  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));
  //ACCUM
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

      for (let i = 0; i < accumArr.length - 1; i++) {
        let accumObj = {
          source: 'accum',
          action: 'btts',
          checked: false,
          homeTeam: '',
          date: todayString,
          predictionDate: '',
        };

        if (i === 0 || i % 2 === 0) {
          accumObj.homeTeam = accumArr[i].team.trim();
          accumObj.predictionDate = accumArr[i + 1].predictionDate;
        }
        // console.log('accumArr[i]', accumArr[i]);
        // console.log('accumObj', accumObj);
        accumObj.homeTeam !== '' && btts.push(accumObj);
      }
    })
    .catch((err) => console.log(err));

  //FST
  await axios(url_fst)
    .then((response) => {
      const html = response.data;
      // const over25 = [];
      const $ = cheerio.load(html);

      $('.Leg__title', html).each(function () {
        let homeTeam = '';
        let awayTeam = '';

        homeTeam = $(this).find('.Leg__lose').text().split('vs')[0];
        awayTeam = $(this).find('.Leg__lose').text().split('vs')[1];

        homeTeam !== '' &&
          btts.push({
            source: 'fst',
            action: 'btts',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));
};

module.exports = { scrapeBtts };
