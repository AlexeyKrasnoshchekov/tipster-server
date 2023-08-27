const axios = require('axios');
const cheerio = require('cheerio');
// const { ProxyCrawlAPI } = require('proxycrawl');
// const api1 = new ProxyCrawlAPI({ token: 'IpErJSu5VcdhkKqgLRJiwQ' });
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const getPred = (pred, homeTeam, awayTeam) => {
  if (pred.includes('1') || pred.includes('1X')) {
    return homeTeam;
  }
  if (pred.includes('2') || pred.includes('X2')) {
    return awayTeam;
  }
};
const getAction = (pred) => {
  if (pred.includes('1') || pred.includes('2')) {
    return 'win';
  } else {
    return 'Xwin';
  }
};

const scrapeWinData = async function (winData) {
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

  const url_passion = 'https://passionpredict.com/home-wins';
  const url_footsuper =
    'https://www.footballsuper.tips/todays-free-football-super-tips/';
  // const url_wdw = 'https://www.windrawwin.com/best-bets-today/';
  const url_bankerHome = 'https://bankerpredict.com/home-wins';
  // const url_bettingtips = 'https://www.bettingtips.today/football-accumulators-tips/';
  const url_bankerAway = 'https://bankerpredict.com/away-wins';
  const url_soccertipz = 'https://www.soccertipz.com/sure-bets-predictions/';
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
  const url_mines = `https://api.betmines.com/betmines/v1/fixtures/betmines-machine?dateFormat=extended&platform=website&from=2023-08-${day}T00:00:00Z&to=2023-08-${dayTom}T07:00:00Z&minOdd=1.3&maxOdd=1.6&limit=20&minProbability=1&maxProbability=100&odds=1X,X2&leagueIds=`;
  const url_fbp =
    'https://footballpredictions.net/sure-bets-sure-win-predictions';

  //WDW
  //  await axios(url_wdw)
  //  .then((response) => {
  //    const html = response.data;
  // console.log(response.data);
  //  console.log('000', html);
  //  const $ = cheerio.load(html);

  //  $('.sbcont', html).each(function () {
  //    //<-- cannot be a function expression
  //    // const title = $(this).text();
  //    const prediction = $(this).find('.sbbet').find('a:first')
  //    .text();

  //    let odds = $(this).find('.sbodds').find('a:first')
  //    .text();
  //    odds = parseFloat(odds);

  //    let homeTeam = $(this).find('.sbgame').find('a:first')
  //    .text()
  //    .split(' v ')[0];
  //    let awayTeam = $(this).find('.sbgame').find('a:first')
  //    .text()
  //    .split(' v ')[1];

  //    homeTeam =
  //      getHomeTeamName(homeTeam.trim()) !== ''
  //        ? getHomeTeamName(homeTeam.trim())
  //        : homeTeam.trim();

  //      homeTeam !== '' &&
  //      prediction !== '' &&
  //      odds <= 1.8 &&
  //      winData.push({
  //        source: 'wdw',
  //        action: 'win',
  //        isAcca:true,
  //        homeTeam: homeTeam,
  //        awayTeam,
  //        date: todayString,
  //        prediction: prediction.includes(homeTeam) ? homeTeam : awayTeam,
  //      });
  //  });

  // res.json(btts);
  //  })
  //  .catch((err) => console.log(err));

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
        const score = $(this).find('td:nth-child(4)').text();

        homeTeam &&
          homeTeam !== '' &&
          awayTeam &&
          awayTeam !== '' &&
          winData.push({
            source: 'soccertipz',
            action: `Win score:${score}`,
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

  //         homeTeam !== '' && (pred.includes('1') || pred.includes('2')) &&
  //         winData.push({
  //             source: 'bettingtips',
  //             action: 'win',
  //             isAcca: true,
  //             homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
  //             awayTeam,
  //             date: todayString,
  //             prediction: pred.includes('1') ? homeTeam : awayTeam,
  //           });
  //     });

  //   } else {
  //     console.log('Failed: ', response.statusCode, response.originalStatus);
  //   }

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

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

  //Betgenuine
  // await axios(url_betgenuine)
  // .then((response) => {
  //   const html = response.data;

  //   // console.log('000', html);
  //   const $ = cheerio.load(html);

  //   $('tr', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();
  //     const homeTeam = $(this).find('td:nth-child(2)').text();
  //     const awayTeam = $(this).find('td:nth-child(4)').text();

  //     const tip = $(this).find('td:nth-child(5)').text();

  //     homeTeam &&
  //     homeTeam !== '' &&
  //     awayTeam &&
  //     awayTeam !== '' &&
  //     winData.push({
  //         source: 'betgenuine',
  //         action: tip.includes('X') ? 'XWin' : 'Win',
  //         checked: false,
  //         isAcca: false,
  //         homeTeam:
  //           getHomeTeamName(homeTeam.trim()) !== ''
  //             ? getHomeTeamName(homeTeam.trim())
  //             : homeTeam.trim(),
  //         awayTeam: getHomeTeamName(awayTeam.trim()) !== ''
  //         ? getHomeTeamName(awayTeam.trim())
  //         : awayTeam.trim(),
  //         date: todayString,
  //         prediction: tip.includes('1') ? homeTeam : awayTeam,
  //       });
  //   });

  //   // res.json(over25);
  // })
  // .catch((err) => console.log(err));

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

  //SURETIPS
  // await axios(url_suretips)
  //   .then((response) => {
  //     const html = response.data;
  //     // console.log(response.data);
  //     console.log('000', response);
  //     const $ = cheerio.load(html);

  //     $('.wpb_content_element', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       let predictionDate = $(this)
  //         .find('.section-heading')
  //         .find('.h-text')
  //         .text();

  //         if (predictionDate.includes(`${day}`)) {
  //           $('tr', this).each(function () {
  //               let teams = $(this)
  //                   .find('td:nth-child(2)')
  //                   .text();

  //               console.log('teams',teams);

  //               let homeTeam = teams.split(' – ')[0];
  //               // homeTeam =
  //               // getHomeTeamName(homeTeam.trim()) !== ''
  //               //     ? getHomeTeamName(homeTeam.trim())
  //               //     : homeTeam.trim();
  //               console.log('homeTeam',homeTeam);

  //               let awayTeam = teams.split(' – ')[1];
  //               // awayTeam =
  //               // getHomeTeamName(awayTeam.trim()) !== ''
  //               //     ? getHomeTeamName(awayTeam.trim())
  //               //     : awayTeam.trim();
  //               console.log('awayTeam',awayTeam);

  //               let prediction = $(this)
  //               .find('td:nth-child(3)')
  //               .text();

  //               homeTeam !== '' &&
  //               prediction !== '' &&
  //               winData.push({
  //                 source: 'suretips',
  //                 action: prediction.includes('1') || prediction.includes('2') ? 'win' : 'Xwin',
  //                 homeTeam: homeTeam,
  //                 awayTeam,
  //                 date: todayString,
  //                 prediction: (prediction.includes('1') || prediction.includes('1X') && homeTeam) ||  (prediction.includes('2') || prediction.includes('X2') && awayTeam),
  //               });
  //           });
  //         }

  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));

  //SURESOCCER
  // await axios(url_suresoccer)
  //   .then((response) => {
  //     const html = response.data;
  //     // console.log(response.data);
  //     console.log('000', response);
  //     const $ = cheerio.load(html);

  //     $('.wpb_content_element', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       let predictionDate = $(this)
  //         .find('.section-heading')
  //         .find('.h-text')
  //         .text();

  //         if (predictionDate.includes(`${day}`)) {
  //           $('tr', this).each(function () {
  //               let teams = $(this)
  //                   .find('td:nth-child(2)')
  //                   .text();

  //               console.log('teams',teams);

  //               let homeTeam = teams.split(' – ')[0];
  //               // homeTeam =
  //               // getHomeTeamName(homeTeam.trim()) !== ''
  //               //     ? getHomeTeamName(homeTeam.trim())
  //               //     : homeTeam.trim();
  //               console.log('homeTeam',homeTeam);

  //               let awayTeam = teams.split(' – ')[1];
  //               // awayTeam =
  //               // getHomeTeamName(awayTeam.trim()) !== ''
  //               //     ? getHomeTeamName(awayTeam.trim())
  //               //     : awayTeam.trim();
  //               console.log('awayTeam',awayTeam);

  //               let prediction = $(this)
  //               .find('td:nth-child(3)')
  //               .text();

  //               homeTeam !== '' &&
  //               prediction !== '' &&
  //               winData.push({
  //                 source: 'suresoccer',
  //                 action: getAction(prediction),
  //                 homeTeam: homeTeam,
  //                 awayTeam,
  //                 date: todayString,
  //                 prediction: `${prediction},${homeTeam},${awayTeam}`,
  //               });
  //           });
  //         }

  //     });

  //     // res.json(btts);
  //   })
  //   .catch((err) => console.log(err));

  //WBO
  // await axios(url_wbo)
  // .then((response) => {
  //   const html = response.data;
  //   // console.log(response.data);
  // //   console.log('000', response);
  //   const $ = cheerio.load(html);

  //   $('.wpb_row', html).each(function () {
  //     //<-- cannot be a function expression
  //     // const title = $(this).text();

  //     let predictionDate = $(this)
  //       .find('.section-heading')
  //       .find('.h-text')
  //       .text();

  //       console.log('predictionDate',predictionDate);
  //       console.log('bool',predictionDate.includes(`${day}`));

  //       if (predictionDate.includes(`${day}`)) {
  //         $('tr', this).each(function () {
  //             let teams = $(this)
  //                 .find('td:nth-child(2)')
  //                 .text();

  //             console.log('teams',teams);

  //             let homeTeam = teams.split(' – ')[0];
  //             // homeTeam =
  //             // getHomeTeamName(homeTeam.trim()) !== ''
  //             //     ? getHomeTeamName(homeTeam.trim())
  //             //     : homeTeam.trim();
  //             console.log('homeTeam',homeTeam);

  //             let awayTeam = teams.split(' – ')[1];
  //             // awayTeam =
  //             // getHomeTeamName(awayTeam.trim()) !== ''
  //             //     ? getHomeTeamName(awayTeam.trim())
  //             //     : awayTeam.trim();
  //             console.log('awayTeam',awayTeam);

  //             let prediction = $(this)
  //             .find('td:nth-child(3)')
  //             .text();

  //             homeTeam !== '' &&
  //             prediction !== '' &&
  //             winData.push({
  //               source: 'wbo',
  //               action: getAction(prediction),
  //               homeTeam: homeTeam,
  //               awayTeam,
  //               date: todayString,
  //               prediction: `${prediction},${homeTeam},${awayTeam}`,
  //             });
  //         });
  //       }

  //   });

  //   // res.json(btts);
  // })
  // .catch((err) => console.log(err));

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

  //BANKER HOME
  await axios(url_bankerHome)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('tr', html).each(function () {
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
        const tip = $(this).find('td:nth-child(4)').find('span:first').text();

        homeTeam !== '' &&
          winData.push({
            source: 'banker',
            action: tip.includes('1X') ? 'XWin' : 'Win',
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

  //BANKER AWAY
  await axios(url_bankerAway)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('tr', html).each(function () {
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
        const tip = $(this).find('td:nth-child(4)').find('span:first').text();

        homeTeam !== '' &&
          winData.push({
            source: 'banker',
            action: tip.includes('2X') ? 'XWin' : 'Win',
            checked: false,
            homeTeam: homeTeam.trim(),
            awayTeam: awayTeam.trim(),
            date: todayString,
            prediction:
              tip.includes('2') || tip.includes('2X') ? homeTeam : awayTeam,
          });
      });

      // res.json(over25);
    })
    .catch((err) => console.log(err));

  // //MINES
  await axios(url_mines)
    .then((response) => {
      const data = response.data;

      data.forEach((elem) => {
        elem !== '' &&
          winData.push({
            source: 'mines',
            action: `${elem.bestOdd} ${elem.bestOddProbability}%`,
            homeTeam: elem.localTeam.name,
            awayTeam: elem.visitorTeam.name,
            prediction:
              elem.bestOdd === 'X2'
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
};

module.exports = { scrapeWinData };
