const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeMorphTotals = async function (allData) {
  const today = new Date();
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const todayString = formattedToday.toString();

  let dataOver25 = [
    {
      countryName: 'Mexico',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/mx.png',
      leagueName: 'Liga MX',
      data: '19:00',
      localTeamName: 'Toluca',
      localTeamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/7/967.png',
      visitorTeamName: 'Mazatlán',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/team_placeholder.png',
      bet: 'O25',
      betQuote: 1.59,
      probability: 100,
      matchDate: '0001-01-01T00:00:00',
      betState: 0,
      hits: 0,
    },
    {
      countryName: 'Poland',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/pl.png',
      leagueName: '1. Liga',
      data: '12:40',
      localTeamName: 'ŁKS Łódź',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/26/12090.png',
      visitorTeamName: 'Stal Rzeszów',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/10/5450.png',
      bet: 'O25',
      betQuote: 1.9,
      probability: 92.86,
      matchDate: '0001-01-01T00:00:00',
      betState: 0,
      hits: 0,
    },
    {
      countryName: 'Hong Kong',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/hk.png',
      leagueName: 'Premier League',
      data: '08:00',
      localTeamName: 'Sham Shui Po',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/28/18140.png',
      visitorTeamName: 'Southern District',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/14/5806.png',
      bet: 'O25',
      betQuote: 1.62,
      probability: 100,
      matchDate: '0001-01-01T00:00:00',
      betState: 0,
      hits: 0,
    },
  ];

  let dataBtts = [
    {
      countryName: 'Turkey',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/tr.png',
      leagueName: 'Super Lig',
      data: null,
      localTeamName: 'Trabzonspor',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/16/688.png',
      visitorTeamName: 'Adana Demirspor',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/15/1039.png',
      bet: 'GG',
      betQuote: 1.67,
      probability: 64.71,
      matchDate: '2023-03-12T13:00:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Austria',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/at.png',
      leagueName: 'Admiral Bundesliga',
      data: null,
      localTeamName: 'LASK Linz',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/9/3369.png',
      visitorTeamName: 'Salzburg',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/17/49.png',
      bet: 'GG',
      betQuote: 1.62,
      probability: 65.93,
      matchDate: '2023-03-12T16:00:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Germany',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/de.png',
      leagueName: '3. Liga',
      data: null,
      localTeamName: 'Wehen Wiesbaden',
      localTeamLogo:
        'https://bm-assets.ams3.digitaloceanspaces.com/teams/bundesliga2/wehen.png',
      visitorTeamName: 'Saarbrücken',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/19/1331.png',
      bet: 'GG',
      betQuote: 1.67,
      probability: 66.1,
      matchDate: '2023-03-12T13:00:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Germany',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/de.png',
      leagueName: 'Bundesliga',
      data: null,
      localTeamName: 'Werder Bremen',
      localTeamLogo:
        'https://bm-assets.ams3.digitaloceanspaces.com/teams/werder.png',
      visitorTeamName: 'Bayer 04 Leverkusen',
      visitorTeamLogo:
        'https://bm-assets.ams3.digitaloceanspaces.com/teams/leverkusen.png',
      bet: 'GG',
      betQuote: 1.57,
      probability: 62.31,
      matchDate: '2023-03-12T16:30:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Switzerland',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/ch.png',
      leagueName: 'Challenge League',
      data: null,
      localTeamName: 'Thun',
      localTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/31/10655.png',
      visitorTeamName: 'Wil',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/31/2655.png',
      bet: 'GG',
      betQuote: 1.53,
      probability: 67.09,
      matchDate: '2023-03-12T15:30:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Switzerland',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/ch.png',
      leagueName: 'Challenge League',
      data: null,
      localTeamName: 'Neuchâtel Xamax',
      localTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/20/500.png',
      visitorTeamName: 'Yverdon Sport',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/2/10210.png',
      bet: 'GG',
      betQuote: 1.53,
      probability: 65.22,
      matchDate: '2023-03-12T15:30:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Switzerland',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/ch.png',
      leagueName: 'Super League',
      data: null,
      localTeamName: 'Basel',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/20/468.png',
      visitorTeamName: 'St. Gallen',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/10/362.png',
      bet: 'GG',
      betQuote: 1.5,
      probability: 65.08,
      matchDate: '2023-03-12T15:30:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Chile',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/cl.png',
      leagueName: 'Primera Division',
      data: null,
      localTeamName: 'Universidad Católica',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/22/2710.png',
      visitorTeamName: 'Unión Española',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/18/10258.png',
      bet: 'GG',
      betQuote: 1.62,
      probability: 63.16,
      matchDate: '2023-03-12T15:00:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Belgium',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/be.png',
      leagueName: 'Pro League',
      data: null,
      localTeamName: 'Club Brugge',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/20/340.png',
      visitorTeamName: 'Standard Liège',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/28/700.png',
      bet: 'GG',
      betQuote: 1.67,
      probability: 62.79,
      matchDate: '2023-03-12T12:30:00',
      betState: 0,
      hits: 4,
    },
    {
      countryName: 'Germany',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/de.png',
      leagueName: '2. Bundesliga',
      data: null,
      localTeamName: 'Karlsruher SC',
      localTeamLogo:
        'https://bm-assets.ams3.digitaloceanspaces.com/teams/bundesliga2/karl.png',
      visitorTeamName: 'Hamburger SV',
      visitorTeamLogo:
        'https://bm-assets.ams3.digitaloceanspaces.com/teams/bundesliga2/hamburger.png',
      bet: 'GG',
      betQuote: 1.5,
      probability: 62.07,
      matchDate: '2023-03-12T12:30:00',
      betState: 0,
      hits: 3,
    },
  ];

  let dataOver15 = [
    {
      countryName: 'Germany',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/de.png',
      leagueName: 'Bundesliga',
      data: null,
      localTeamName: 'Werder Bremen',
      localTeamLogo:
        'https://bm-assets.ams3.digitaloceanspaces.com/teams/werder.png',
      visitorTeamName: 'Bayer 04 Leverkusen',
      visitorTeamLogo:
        'https://bm-assets.ams3.digitaloceanspaces.com/teams/leverkusen.png',
      bet: 'O15',
      betQuote: 1.2,
      probability: 90.86,
      matchDate: '2023-03-12T16:30:00',
      betState: 0,
      hits: 8,
    },
    {
      countryName: 'Belgium',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/be.png',
      leagueName: 'Pro League',
      data: null,
      localTeamName: 'Club Brugge',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/20/340.png',
      visitorTeamName: 'Standard Liège',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/28/700.png',
      bet: 'O15',
      betQuote: 1.2,
      probability: 82.07,
      matchDate: '2023-03-12T12:30:00',
      betState: 0,
      hits: 7,
    },
    {
      countryName: 'Austria',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/at.png',
      leagueName: 'Admiral Bundesliga',
      data: null,
      localTeamName: 'LASK Linz',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/9/3369.png',
      visitorTeamName: 'Salzburg',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/17/49.png',
      bet: 'O15',
      betQuote: 1.2,
      probability: 90.91,
      matchDate: '2023-03-12T16:00:00',
      betState: 0,
      hits: 7,
    },
    {
      countryName: 'England',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/gb.png',
      leagueName: 'Premier League',
      data: null,
      localTeamName: 'West Ham United',
      localTeamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/1/1.png',
      visitorTeamName: 'Aston Villa',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/15/15.png',
      bet: 'O15',
      betQuote: 1.33,
      probability: 80,
      matchDate: '2023-03-12T14:00:00',
      betState: 0,
      hits: 7,
    },
    {
      countryName: 'Denmark',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/dk.png',
      leagueName: 'Superliga',
      data: null,
      localTeamName: 'Viborg',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/15/2447.png',
      visitorTeamName: 'Nordsjælland',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/26/2394.png',
      bet: 'O15',
      betQuote: 1.29,
      probability: 81.25,
      matchDate: '2023-03-12T13:00:00',
      betState: 0,
      hits: 6,
    },
    {
      countryName: 'Australia',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/au.png',
      leagueName: 'A-League',
      data: null,
      localTeamName: 'Wellington Phoenix',
      localTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/12/1868.png',
      visitorTeamName: 'Sydney',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/29/253.png',
      bet: 'O15',
      betQuote: 1.22,
      probability: 82.63,
      matchDate: '2023-03-12T02:00:00',
      betState: 0,
      hits: 5,
    },
    {
      countryName: 'Cyprus',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/cy.png',
      leagueName: '1. Division',
      data: null,
      localTeamName: 'Paphos',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/23/8119.png',
      visitorTeamName: 'Aris',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/14/526.png',
      bet: 'O15',
      betQuote: 1.36,
      probability: 90.48,
      matchDate: '2023-03-12T15:00:00',
      betState: 0,
      hits: 5,
    },
    {
      countryName: 'Portugal',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/pt.png',
      leagueName: 'Segunda Liga',
      data: null,
      localTeamName: 'Sporting Covilhã',
      localTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/21/6997.png',
      visitorTeamName: 'Benfica II',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/2/2946.png',
      bet: 'O15',
      betQuote: 1.25,
      probability: 84.38,
      matchDate: '2023-03-12T11:00:00',
      betState: 0,
      hits: 5,
    },
    {
      countryName: 'England',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/gb.png',
      leagueName: 'Premier League',
      data: null,
      localTeamName: 'Fulham',
      localTeamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/11/11.png',
      visitorTeamName: 'Arsenal',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/19/19.png',
      bet: 'O15',
      betQuote: 1.22,
      probability: 80,
      matchDate: '2023-03-12T14:00:00',
      betState: 0,
      hits: 5,
    },
    {
      countryName: 'Austria',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/at.png',
      leagueName: 'Admiral Bundesliga',
      data: null,
      localTeamName: 'Sturm Graz',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/29/3357.png',
      visitorTeamName: 'Austria Wien',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/14/3630.png',
      bet: 'O15',
      betQuote: 1.22,
      probability: 81.58,
      matchDate: '2023-03-12T16:00:00',
      betState: 0,
      hits: 4,
    },
  ];

  // const optionsOver15 = {
  //   method: 'GET',
  //   url: 'https://morpheus-predictions.p.rapidapi.com/BestOver15',
  //   headers: {
  //     'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
  //     'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
  //   },
  // };

  // const optionsOver25 = {
  //   method: 'GET',
  //   url: 'https://morpheus-predictions.p.rapidapi.com/TopOver25',
  //   headers: {
  //     'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
  //     'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
  //   },
  // };

  // const optionsBestGoal = {
  //   method: 'GET',
  //   url: 'https://morpheus-predictions.p.rapidapi.com/BestGoal',
  //   headers: {
  //     'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
  //     'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
  //   },
  // };

  dataOver15.length !== 0 &&
    dataOver15.forEach((elem) => {
      allData.push({
        source: 'morph',
        action: 'over15',
        homeTeam:
          getHomeTeamName(elem.localTeamName.trim()) !== ''
            ? getHomeTeamName(elem.localTeamName.trim())
            : elem.localTeamName.trim(),
        awayTeam: elem.visitorTeamName,
        date: todayString,
        predictionDate: `morph hits ${elem.hits}`,
      });
    });

  dataOver25.length !== 0 &&
    dataOver25.forEach((elem) => {
      allData.push({
        source: 'morph',
        action: 'over25',
        homeTeam:
          getHomeTeamName(elem.localTeamName.trim()) !== ''
            ? getHomeTeamName(elem.localTeamName.trim())
            : elem.localTeamName.trim(),
        awayTeam: elem.visitorTeamName,
        date: todayString,
        predictionDate: `morph hits ${elem.hits}`,
      });
    });

  dataBtts.length !== 0 &&
    dataBtts.forEach((elem) => {
      allData.push({
        source: 'morph',
        action: 'btts',
        homeTeam:
          getHomeTeamName(elem.localTeamName.trim()) !== ''
            ? getHomeTeamName(elem.localTeamName.trim())
            : elem.localTeamName.trim(),
        awayTeam: elem.visitorTeamName,
        date: todayString,
        predictionDate: `morph hits ${elem.hits}`,
      });
    });

  // await axios
  //   .request(optionsOver15)
  //   .then(function (response) {
  //     console.log('response.optionsOver15', response.data);
  //     const data = response.data;

  //     data.length !== 0 &&
  //       data.forEach((elem) => {
  //         allData.push({
  //           source: 'morph',
  //           action: 'over15',
  //           homeTeam:
  //             getHomeTeamName(elem.localTeamName.trim()) !== ''
  //               ? getHomeTeamName(elem.localTeamName.trim())
  //               : elem.localTeamName.trim(),
  //           awayTeam: elem.visitorTeamName,
  //           date: todayString,
  //           predictionDate: `morph hits ${elem.hits}`,
  //         });
  //       });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  // await axios
  //   .request(optionsOver25)
  //   .then(function (response) {
  //     console.log('response.optionsOver25', response.data);
  //     const data = response.data;

  //     data.length !== 0 &&
  //       data.forEach((elem) => {
  //         allData.push({
  //           source: 'morph',
  //           action: 'over25',
  //           homeTeam:
  //             getHomeTeamName(elem.localTeamName.trim()) !== ''
  //               ? getHomeTeamName(elem.localTeamName.trim())
  //               : elem.localTeamName.trim(),
  //           awayTeam: elem.visitorTeamName,
  //           date: todayString,
  //           predictionDate: `morph hits ${elem.hits}`,
  //         });
  //       });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  // await axios
  //   .request(optionsBestGoal)
  //   .then(function (response) {
  //     console.log('response.optionsBestGoal', response.data);
  //     const data = response.data;

  //     data.length !== 0 &&
  //       data.forEach((elem) => {
  //         allData.push({
  //           source: 'morph',
  //           action: 'btts',
  //           homeTeam:
  //             getHomeTeamName(elem.localTeamName.trim()) !== ''
  //               ? getHomeTeamName(elem.localTeamName.trim())
  //               : elem.localTeamName.trim(),
  //           awayTeam: elem.visitorTeamName,
  //           date: todayString,
  //           predictionDate: `morph hits ${elem.hits}`,
  //         });
  //       });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
};

module.exports = { scrapeMorphTotals };
