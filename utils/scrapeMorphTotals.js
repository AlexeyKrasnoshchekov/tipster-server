const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeMorphTotals = async function (allData) {
  const today = new Date();
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const todayString = formattedToday.toString();

  const optionsOver15 = {
    method: 'GET',
    url: 'https://morpheus-predictions.p.rapidapi.com/BestOver15',
    headers: {
      'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
      'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
    },
  };

  const optionsOver25 = {
    method: 'GET',
    url: 'https://morpheus-predictions.p.rapidapi.com/TopOver25',
    headers: {
      'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
      'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
    },
  };

  const optionsBestGoal = {
    method: 'GET',
    url: 'https://morpheus-predictions.p.rapidapi.com/BestGoal',
    headers: {
      'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
      'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
    },
  };

  await axios
    .request(optionsOver15)
    .then(function (response) {
      console.log('response.optionsOver15', response.data);
      const data = response.data;

      data.length !== 0 &&
        data.forEach((elem) => {
          allData.push({
            source: 'morph',
            action: `over15 prob ${elem.probability}`,
            isAcca: elem.probability >= 90,
            homeTeam: elem.localTeamName.trim(),
            awayTeam: elem.visitorTeamName.trim(),
            date: todayString,
            predictionDate: `morph hits ${elem.hits}`,
          });
        });
    })
    .catch(function (error) {
      console.error(error);
    });

  await axios
    .request(optionsOver25)
    .then(function (response) {
      console.log('response.optionsOver25', response.data);
      const data = response.data;

      data.length !== 0 &&
        data.forEach((elem) => {
          allData.push({
            source: 'morph',
            action: `over25 prob ${elem.probability}`,
            isAcca: elem.probability >= 90,
            homeTeam: elem.localTeamName.trim(),
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
    .request(optionsBestGoal)
    .then(function (response) {
      console.log('response.optionsBestGoal', response.data);
      const data = response.data;

      data.length !== 0 &&
        data.forEach((elem) => {
          allData.push({
            source: 'morph',
            action: `btts prob ${elem.probability}`,
            isAcca: elem.probability >= 90,
            homeTeam: elem.localTeamName.trim(),
            awayTeam: elem.visitorTeamName,
            date: todayString,
            predictionDate: `morph hits ${elem.hits}`,
          });
        });
    })
    .catch(function (error) {
      console.error(error);
    });
};

module.exports = { scrapeMorphTotals };
