const axios = require('axios');
const { gotScraping } = require('got-scraping');
const cheerio = require('cheerio');
const fns = require('date-fns');
// import { gotScraping } from "got-scraping";
const puppeteer = require('puppeteer');
const { getHomeTeamName } = require('../utils');

const scrapeBtts = async function (btts) {
  const url_fbp =
    'https://footballpredictions.net/btts-tips-both-teams-to-score-predictions';
  const url_accum = 'https://footyaccumulators.com/football-tips/btts';
  const url_fst = 'https://www.freesupertips.com/free-football-betting-tips/';
  const url_footy = 'https://footystats.org/predictions/btts';
  const url_mighty = 'https://www.mightytips.com/football-predictions/btts/';
  // const url_mybets =
  //   'https://www.mybets.today/soccer-predictions/both-teams-to-score-predictions/';
  const url_fbpai =
    'https://footballpredictions.ai/football-predictions/btts-predictions/';

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


  // FBP
  await axios(url_fbp)
  .then((response) => {
    const html = response.data;
    // console.log(response.data);
    // console.log('000', response);
    const $ = cheerio.load(html);

    $('.match-preview', html).each(function () {
      //<-- cannot be a function expression
      // const title = $(this).text();
      const homeTeam = $(this)
        .find('.home-team')
        .find('.team-label')
        .text();
      const awayTeam = $(this)
        .find('.away-team')
        .find('.team-label')
        .text();
      const predictionDate = $(this)
        .find('.match-preview-date')
        .find('.full-cloak')
        .text();

        if (homeTeam.trim() === 'Al-Gharafa') {
          console.log('ghghgj', getHomeTeamName(homeTeam.trim()))
        };
      homeTeam !== '' &&
        btts.push({
          source: 'fbp',
          action: 'btts',
          checked: false,
          homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
          awayTeam,
          date: todayString,
          predictionDate: predictionDate,
        });
    });

    // res.json(btts);
  })
  .catch((err) => console.log(err));

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
            console.log('btts HT', getHomeTeamName(homeTeam.trim()))
          };

        todayString.includes(predicDate) &&
          homeTeam !== '' &&
          btts.push({
            source: 'mighty',
            action: 'btts',
            checked: false,
            homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  // //PASSION
  await axios(
    `https://passionpredict.com/both-team-to-score?dt=${year}-${month}-${day}`
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
          btts.push({
            source: 'passion',
            action: 'btts',
            checked: false,
            homeTeam: getHomeTeamName(elem) !=='' ? getHomeTeamName(elem) : elem,
            awayTeam: '',
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
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

        homeTeam1 !== '' &&
          btts.push({
            source: 'footy',
            action: 'btts',
            checked: false,
            homeTeam: getHomeTeamName(homeTeam1.trim()) !=='' ? getHomeTeamName(homeTeam1.trim()) : homeTeam1.trim(),
            awayTeam,
            date: todayString,
          });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  // //Fbpai
  await axios(url_fbpai)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.footgame', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();

        const isBttsFbpai = $(this).find('.match-tip-show').text();

        if (isBttsFbpai === 'Yes') {
          const homeTeam = $(this)
            .find('a:first')
            .attr('title')
            .split(' - ')[0];
          const awayTeam = $(this)
            .find('a:first')
            .attr('title')
            .split(' - ')[1];

          homeTeam !== '' &&
            btts.push({
              source: 'fbpai',
              action: 'btts',
              checked: false,
              homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
        }
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  // //ACCUM
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
          accumObj.homeTeam = getHomeTeamName(accumArr[i].team.trim()) !=='' ? getHomeTeamName(accumArr[i].team.trim()) : accumArr[i].team.trim();
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
      // const btts = [];
      const $ = cheerio.load(html);

      $('.Leg__title', html).each(function () {
        const isBttsFst = $(this).find('.Leg__win').text();
        let homeTeam = '';
        let awayTeam = '';
        if (isBttsFst === 'Both Teams To Score') {
          homeTeam = $(this).find('.Leg__lose').text().split('vs')[0];
          awayTeam = $(this).find('.Leg__lose').text().split('vs')[1];
          homeTeam !== '' &&
            btts.push({
              source: 'fst',
              action: 'btts',
              checked: false,
              homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
        }
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
};

module.exports = { scrapeBtts };
