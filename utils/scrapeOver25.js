const axios = require('axios');
const cheerio = require('cheerio');

const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeOver25 = async function (over25) {
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

  // const url_goalnow = 'https://www.goalsnow.com/over-under-predictions/';
  const url_gnow_accum = 'https://www.goalsnow.com/accumulator-over-2.5-goals/';

  // const url_soccertipz = 'https://www.soccertipz.com/under-over-2-5-predictions/';
  const url_banker = 'https://bankerpredict.com/over-2-5-goals';
  const url_prot = 'https://www.protipster.com/betting-tips/over-2.5-goals';
  const url_fbp =
    'https://footballpredictions.net/under-over-2-5-goals-betting-tips-predictions';
  const url_accum =
    'https://footyaccumulators.com/football-tips/over-2-5-trebles';
  const url_fst =
    'https://www.freesupertips.com/over-2-5-goals-betting-tips-and-predictions/';
  const url_footy = 'https://footystats.org/predictions/over-25-goals';
  // const url_venasbet = 'https://venasbet.com/over-2-5-goals-prediction';
  const url_r2bet = 'https://r2bet.com/2_5_goals';
  const url_hello = 'https://hellopredict.com/2_5_goals';
  // const url_nvtips = 'https://nvtips.com/ru/';
  const url_footsuper =
    'https://www.footballsuper.tips/todays-over-under-football-super-tips/';
  const url_footsuper_o25 =
    'https://www.footballsuper.tips/football-accumulators-tips/football-tips-match-goals-accumulator/';

  // const url_o25tips = 'https://www.over25tips.com/';
  // const url_zakabet = 'https://zakabet.com/over-2-5-goals/';
  // const url_mybets =
  //   'https://www.mybets.today/soccer-predictions/under-over-2-5-goals-predictions/';
  // const url_fbpai =
  //   'https://footballpredictions.ai/football-predictions/over-under-predictions/';

  const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-08-${day}T00:00:00Z&to=2023-08-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=OVER_25&leagueIds=`;

  //PASSION
  // await axios(
  //   `https://passionpredict.com/over-2-5-goals?dt=${year}-${month}-${day}`
  // )
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);
  //     let homeTeamsArr = [];
  //     // let pred;

  //     $('tr', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();
  //       const homeTeam = $(this)
  //         .find('td:nth-child(3)')
  //         .find('span:first')
  //         .text()
  //         .split(' VS')[0];

  //       let pred = $(this).find('td:nth-child(4)').find('span:first').text();

  //       // const awayTeam = $(this).find('tr').find('td:nth-child(3)').find('span:first').text().split(' "" ')[1].split(' VS')[1];
  //       // const awayTeam = $(this).find('.mtl-index-page-matches__name').text().split(' vs ')[1];
  //       // const predicDate = $(this).find('.mtl-index-page-matches__date').find('p:first').find('time:first').text();
  //       // console.log('homeTeamPass', homeTeam);
  //       homeTeam !== '' &&
  //         pred !== '' &&
  //         pred.includes('Over') &&
  //         homeTeamsArr.push({ homeTeam: homeTeam, pred: pred });
  //     });
  //     // console.log('homeTeamsArr', homeTeamsArr);
  //     // homeTeamsArr.splice(0, 1);
  //     // // console.log('homeTeamsArr111', homeTeamsArr);
  //     // let indexOfEmpty = homeTeamsArr.indexOf('');
  //     // // console.log('indexOfEmpty', indexOfEmpty);
  //     // let todayHomeTeamsArr = homeTeamsArr.slice(indexOfEmpty + 1);
  //     // console.log('homeTeamsArr', homeTeamsArr);
  //     homeTeamsArr.forEach((elem) => {
  //       elem.homeTeam !== '' &&
  //         elem.pred !== '' &&
  //         elem.pred.includes('Over') &&
  //         over25.push({
  //           source: 'passion',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(elem.homeTeam.trim()) !== ''
  //               ? getHomeTeamName(elem.homeTeam.trim())
  //               : elem.homeTeam.trim(),
  //           awayTeam: '',
  //           date: todayString,
  //         });
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

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
            source: 'banker',
            action: 'over25',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
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
  //     tip.includes('Over') &&
  //     over25.push({
  //         source: 'soccertipz',
  //         action: 'over25',
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

  // //MINES
  await axios(url_mines)
    .then((response) => {
      const data = response.data;

      data.forEach((elem) => {
        elem !== '' && elem.bestOddProbability > 79 &&
          over25.push({
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
            source: 'footsuper',
            action: 'over25',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  //FOOTSUPER_O25
  await axios(url_footsuper_o25)
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
          over25.push({
            source: 'footsuper_o25',
            action: 'over25',
            isAcca: true,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
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

        homeTeam !== '' &&
          over25.push({
            source: 'prot',
            action: 'over25',
            isAcca: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

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

        let odds = $(this).find('.betHeaderMeta').text();

        const result = $(this).find('.betHeaderMeta').find('.result').text();

        odds =
          odds &&
          odds !== '' &&
          odds.includes(result) &&
          odds.replace(result, '');

        console.log('homeTeam1', homeTeam1);
        console.log('odds', odds);

        homeTeam1 !== '' &&
          parseInt(odds) < 1.7 &&
          over25.push({
            source: 'footy',
            action: 'over25',
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
  //         over25.push({
  //           source: 'venas',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam:
  //             getHomeTeamName(homeTeam.trim()) !== ''
  //               ? getHomeTeamName(homeTeam.trim())
  //               : homeTeam.trim(),
  //           awayTeam: getHomeTeamName(awayTeam.trim()) !== ''
  //           ? getHomeTeamName(awayTeam.trim())
  //           : awayTeam.trim(),
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
        const tip = $(this).find('td:nth-child(4)').text();

        homeTeam !== '' &&
          tip.includes('Over 2.5') &&
          over25.push({
            source: 'r2bet',
            action: 'over25',
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
          over25.push({
            source: 'hello',
            action: 'over25',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

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
  // //Goalnow
  // await axios(url_goalnow)
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
  // const pred = $(this)
  //   .find('.goalstip')
  //   .find('span:first')
  //   .text();
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
        // let homeTeam1 = '';
        // if (homeTeam.includes('2.5 Goals')) {
        //   homeTeam1 = homeTeam.split('Over 2.5 Goals ')[1];
        // }
        // const awayTeam = $(this)
        //   .find('.goalsaway')
        //   .text();
        const pred = $(this).find('.row4').find('span:first').text();
        homeTeam !== '' &&
          pred.includes('Over') &&
          over25.push({
            source: 'gnowAcc',
            action: 'over25',
            checked: false,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam: '',
            date: todayString,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));
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
  //             source: 'fbpai',
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
          source: 'accum',
          action: 'over25',
          checked: false,
          homeTeam: '',
          date: todayString,
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
            source: 'fst',
            action: 'over25',
            isAcca: true,
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
        let awayTeam = teams.includes('vs') && teams.split('vs')[1];
        awayTeam =
          awayTeam.includes(prediction) && awayTeam.replace(prediction, '');

        homeTeam !== '' &&
          prediction.includes('Over') &&
          over25.push({
            source: 'fbp',
            action: 'over25',
            isAcca: true,
            homeTeam:
              getHomeTeamName(homeTeam.trim()) !== ''
                ? getHomeTeamName(homeTeam.trim())
                : homeTeam.trim(),
            awayTeam: awayTeam.replace(prediction, ''),
            date: todayString,
          });
      });

      // res.json(btts);
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
  //       const over25text = $(this).find('.prediction').text();
  //       const over25Yes = over25text.includes('Over');
  //       // console.log('over25Fbp', over25);
  //       const predictionDate = $(this)
  //         .find('.match-preview-date')
  //         .find('.full-cloak')
  //         .text();
  //       homeTeam !== '' &&
  //         over25Yes &&
  //         over25.push({
  //           source: 'fbp',
  //           action: 'over25',
  //           checked: false,
  //           homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
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
  //       const over25text = $(this).find('.tipdiv').find('span:first').text();
  //       const over25Yes = over25text === 'Over';
  //       // console.log('over25Mybets', over25);

  //       if (homeTeam.trim() === 'Accrington ST') {
  //         console.log('over25 HT', getHomeTeamName(homeTeam.trim()))
  //       };

  //       homeTeam !== '' &&
  //         over25Yes &&
  //         over25.push({
  //           source: 'mybets',
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
};

module.exports = { scrapeOver25 };
