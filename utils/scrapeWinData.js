const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeWinData = async function (winData) {
  const url_passion = 'https://passionpredict.com/home-wins';
  const url_mybets = 'https://www.mybets.today/recommended-soccer-predictions/';
  const url_fbp =
    'https://footballpredictions.net/sure-bets-sure-win-predictions';

  const today = new Date();
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const todayString = formattedToday.toString();

  const day = today.getDate();

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
        const predictionDate = $(this)
          .find('.match-preview-date')
          .find('.full-cloak')
          .text();

        homeTeam =
          getHomeTeamName(homeTeam.trim()) !== ''
            ? getHomeTeamName(homeTeam.trim())
            : homeTeam.trim();

        predictionDate.includes(day) &&
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
            homeTeam:
              getHomeTeamName(elem) !== '' ? getHomeTeamName(elem) : elem,
            awayTeam: '',
            prediction:
              getHomeTeamName(elem) !== '' ? getHomeTeamName(elem) : elem,
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

        homeTeam =
          getHomeTeamName(homeTeam.trim()) !== ''
            ? getHomeTeamName(homeTeam.trim())
            : homeTeam.trim();

        awayTeam =
          getHomeTeamName(awayTeam.trim()) !== ''
            ? getHomeTeamName(awayTeam.trim())
            : awayTeam.trim();

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
};

module.exports = { scrapeWinData };
