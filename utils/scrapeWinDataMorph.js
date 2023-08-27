const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeWinDataMorph = async function (winData) {
  const today = new Date();
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const todayString = formattedToday.toString();

  const optionsHomeWin = {
    method: 'GET',
    url: 'https://morpheus-predictions.p.rapidapi.com/Best1',
    headers: {
      'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
      'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
    },
  };

  const optionsAwayWin = {
    method: 'GET',
    url: 'https://morpheus-predictions.p.rapidapi.com/Best2',
    headers: {
      'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
      'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
    },
  };

  await axios
    .request(optionsHomeWin)
    .then(function (response) {
      console.log('response.optionsHomeWin', response.data);
      const data = response.data;

      data.length !== 0 &&
        data.forEach((elem) => {
          winData.push({
            source: 'morph',
            action: `win ${elem.probability}`,
            isAcca: false,
            homeTeam: elem.localTeamName.trim(),
            prediction: elem.localTeamName.trim(),
            awayTeam: elem.visitorTeamName,
            date: todayString,
            predictionDate: `morph hits ${elem.hits}`,
          });
        });
    })
    .catch(function (error) {
      console.error(error);
    });

  await axios
    .request(optionsAwayWin)
    .then(function (response) {
      console.log('response.optionsAwayWin', response.data);
      const data = response.data;

      data.length !== 0 &&
        data.forEach((elem) => {
          winData.push({
            source: 'morph',
            action: `win ${elem.probability}`,
            isAcca: elem.probability >= 90,
            homeTeam: elem.localTeamName.trim(),
            prediction: elem.visitorTeamName.trim(),
            awayTeam: elem.visitorTeamName.trim(),
            date: todayString,
            predictionDate: `morph hits ${elem.hits}`,
          });
        });
    })
    .catch(function (error) {
      console.error(error);
    });
};

module.exports = { scrapeWinDataMorph };
