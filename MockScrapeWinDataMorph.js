const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeWinDataMorph = async function (winData) {
  const today = new Date();
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const todayString = formattedToday.toString();

  // const optionsHomeWin = {
  //   method: 'GET',
  //   url: 'https://morpheus-predictions.p.rapidapi.com/Best1',
  //   headers: {
  //     'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
  //     'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
  //   },
  // };

  // const optionsAwayWin = {
  //   method: 'GET',
  //   url: 'https://morpheus-predictions.p.rapidapi.com/Best2',
  //   headers: {
  //     'X-RapidAPI-Key': 'afdaf280fcmshfd84dc3e92fe9a9p188716jsn24baff0f9e8e',
  //     'X-RapidAPI-Host': 'morpheus-predictions.p.rapidapi.com',
  //   },
  // };

  let dataHomeWin = [
    {
      countryName: 'Netherlands',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/nl.png',
      leagueName: 'Eredivisie',
      data: null,
      localTeamName: 'Feyenoord',
      localTeamLogo: 'https://cdn.sportmonks.com/images//soccer/teams/9/73.png',
      visitorTeamName: 'FC Volendam',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/28/2396.png',
      bet: '1',
      betQuote: 1.13,
      probability: 93.55,
      matchDate: '2023-03-12T19:00:00',
      betState: 0,
      hits: 12,
    },
    {
      countryName: 'England',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/gb.png',
      leagueName: 'Premier League',
      data: null,
      localTeamName: 'Manchester United',
      localTeamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/14/14.png',
      visitorTeamName: 'Southampton',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/1/65.png',
      bet: '1',
      betQuote: 1.33,
      probability: 100,
      matchDate: '2023-03-12T14:00:00',
      betState: 0,
      hits: 12,
    },
    {
      countryName: 'Italy',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/it.png',
      leagueName: 'Serie A',
      data: null,
      localTeamName: 'Juventus',
      localTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/17/625.png',
      visitorTeamName: 'Sampdoria',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/10/522.png',
      bet: '1',
      betQuote: 1.33,
      probability: 100,
      matchDate: '2023-03-12T19:45:00',
      betState: 0,
      hits: 11,
    },
    {
      countryName: 'Netherlands',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/nl.png',
      leagueName: 'Eredivisie',
      data: null,
      localTeamName: 'PSV',
      localTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/10/682.png',
      visitorTeamName: 'SC Cambuur',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/27/1435.png',
      bet: '1',
      betQuote: 1.14,
      probability: 93.55,
      matchDate: '2023-03-12T15:45:00',
      betState: 0,
      hits: 9,
    },
    {
      countryName: 'Poland',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/pl.png',
      leagueName: 'Ekstraklasa',
      data: null,
      localTeamName: 'Legia Warszawa',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/29/349.png',
      visitorTeamName: 'Stal Mielec',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/16/7216.png',
      bet: '1',
      betQuote: 1.45,
      probability: 100,
      matchDate: '2023-03-12T16:30:00',
      betState: 0,
      hits: 9,
    },
    {
      countryName: 'England',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/gb.png',
      leagueName: 'Championship',
      data: null,
      localTeamName: 'Norwich City',
      localTeamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/1/33.png',
      visitorTeamName: 'Sunderland',
      visitorTeamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/3/3.png',
      bet: '1',
      betQuote: 1.83,
      probability: 100,
      matchDate: '2023-03-12T12:00:00',
      betState: 0,
      hits: 7,
    },
    {
      countryName: 'Australia',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/au.png',
      leagueName: 'A-League',
      data: null,
      localTeamName: 'Melbourne City',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/27/315.png',
      visitorTeamName: 'Brisbane Roar',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/22/1238.png',
      bet: '1',
      betQuote: 1.44,
      probability: 100,
      matchDate: '2023-03-12T04:00:00',
      betState: 0,
      hits: 7,
    },
    {
      countryName: 'Portugal',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/pt.png',
      leagueName: 'Liga Portugal',
      data: null,
      localTeamName: 'Sporting CP',
      localTeamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/26/58.png',
      visitorTeamName: 'Boavista',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/0/960.png',
      bet: '1',
      betQuote: 1.25,
      probability: 100,
      matchDate: '2023-03-12T20:30:00',
      betState: 0,
      hits: 7,
    },
    {
      countryName: 'Colombia',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/co.png',
      leagueName: 'Torneo Betplay',
      data: null,
      localTeamName: 'Llaneros',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/17/15153.png',
      visitorTeamName: 'Tigres',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/4/15140.png',
      bet: '1',
      betQuote: 1.85,
      probability: 85.71,
      matchDate: '2023-03-12T20:00:00',
      betState: 0,
      hits: 3,
    },
    {
      countryName: 'Romania',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/ro.png',
      leagueName: 'Liga 2',
      data: null,
      localTeamName: 'Dinamo Bucureşti',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/2/1026.png',
      visitorTeamName: 'ASU Poli Timişoara',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/15/6159.png',
      bet: '1',
      betQuote: 1.29,
      probability: 100,
      matchDate: '2023-03-12T11:00:00',
      betState: 0,
      hits: 3,
    },
  ];
  let dataAwayWin = [
    {
      countryName: 'Portugal',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/pt.png',
      leagueName: 'Liga Portugal',
      data: null,
      localTeamName: 'Marítimo',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/11/5931.png',
      visitorTeamName: 'Benfica',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/29/605.png',
      bet: '2',
      betQuote: 1.25,
      probability: 100,
      matchDate: '2023-03-12T18:00:00',
      betState: 0,
      hits: 13,
    },
    {
      countryName: 'Netherlands',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/nl.png',
      leagueName: 'Eredivisie',
      data: null,
      localTeamName: 'SC Heerenveen',
      localTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/29/1053.png',
      visitorTeamName: 'Ajax',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/21/629.png',
      bet: '2',
      betQuote: 1.44,
      probability: 80,
      matchDate: '2023-03-12T13:30:00',
      betState: 0,
      hits: 8,
    },
    {
      countryName: 'Thailand',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/th.png',
      leagueName: 'Thai Premier League',
      data: null,
      localTeamName: 'Nongbua Pitchaya FC',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/31/15103.png',
      visitorTeamName: 'Buriram United',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/25/6809.png',
      bet: '2',
      betQuote: 1.4,
      probability: 100,
      matchDate: '2023-03-12T12:00:00',
      betState: 0,
      hits: 5,
    },
    {
      countryName: 'Costa Rica',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/cr.png',
      leagueName: 'Primera Division',
      data: null,
      localTeamName: 'Guanacasteca',
      localTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/13/15277.png',
      visitorTeamName: 'Deportivo Saprissa',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images//soccer/teams/28/860.png',
      bet: '2',
      betQuote: 1.55,
      probability: 87.5,
      matchDate: '2023-03-12T21:00:00',
      betState: 0,
      hits: 3,
    },
    {
      countryName: 'Hong Kong',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/hk.png',
      leagueName: 'Premier League',
      data: null,
      localTeamName: 'Sham Shui Po',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/28/18140.png',
      visitorTeamName: 'Southern District',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/14/5806.png',
      bet: '2',
      betQuote: 1.3,
      probability: 100,
      matchDate: '2023-03-12T07:00:00',
      betState: 0,
      hits: 3,
    },
    {
      countryName: 'Romania',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/ro.png',
      leagueName: 'Liga 2',
      data: null,
      localTeamName: 'Unirea Constanța',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/0/257088.png',
      visitorTeamName: 'Viitorul Şelimbăr',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/26/228442.png',
      bet: '2',
      betQuote: 1.13,
      probability: 100,
      matchDate: '2023-03-12T11:00:00',
      betState: 0,
      hits: 3,
    },
    {
      countryName: 'Malta',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/mt.png',
      leagueName: 'Premier League',
      data: null,
      localTeamName: 'Pietà Hotspurs',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/0/9824.png',
      visitorTeamName: 'Gudja United',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/16/7888.png',
      bet: '2',
      betQuote: 1.4,
      probability: 100,
      matchDate: '2023-03-12T14:00:00',
      betState: 0,
      hits: 2,
    },
    {
      countryName: 'Estonia',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/ee.png',
      leagueName: 'Esiliiga A',
      data: null,
      localTeamName: 'K-Järve JK Järve',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/7/8871.png',
      visitorTeamName: 'Viimsi',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/team_placeholder.png',
      bet: '2',
      betQuote: 1.29,
      probability: 87.5,
      matchDate: '2023-03-12T10:30:00',
      betState: 0,
      hits: 2,
    },
    {
      countryName: 'Hong Kong',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/hk.png',
      leagueName: 'Premier League',
      data: null,
      localTeamName: 'Tai Chung',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/9/18121.png',
      visitorTeamName: 'Warriors',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/team_placeholder.png',
      bet: '2',
      betQuote: 1.25,
      probability: 100,
      matchDate: '2023-03-12T10:00:00',
      betState: 0,
      hits: 1,
    },
    {
      countryName: 'Greece',
      countryLogo:
        'https://cdn.sportmonks.com/images/countries/png/short/gr.png',
      leagueName: 'Super League 2 - South',
      data: null,
      localTeamName: 'Egaleo',
      localTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/team_placeholder.png',
      visitorTeamName: 'Kallithea',
      visitorTeamLogo:
        'https://cdn.sportmonks.com/images/soccer/teams/30/5406.png',
      bet: '2',
      betQuote: 1.7,
      probability: 100,
      matchDate: '2023-03-12T12:45:00',
      betState: 0,
      hits: 1,
    },
  ];

  dataHomeWin.length !== 0 &&
    dataHomeWin.forEach((elem) => {
      winData.push({
        source: 'morph',
        action: 'win',
        homeTeam:
          getHomeTeamName(elem.localTeamName.trim()) !== ''
            ? getHomeTeamName(elem.localTeamName.trim())
            : elem.localTeamName.trim(),
        prediction:
          getHomeTeamName(elem.localTeamName.trim()) !== ''
            ? getHomeTeamName(elem.localTeamName.trim())
            : elem.localTeamName.trim(),
        awayTeam: elem.visitorTeamName,
        date: todayString,
        predictionDate: `morph hits ${elem.hits}`,
      });
    });

  dataAwayWin.length !== 0 &&
    dataAwayWin.forEach((elem) => {
      winData.push({
        source: 'morph',
        action: 'win',
        homeTeam:
          getHomeTeamName(elem.localTeamName.trim()) !== ''
            ? getHomeTeamName(elem.localTeamName.trim())
            : elem.localTeamName.trim(),
        prediction:
          getHomeTeamName(elem.visitorTeamName.trim()) !== ''
            ? getHomeTeamName(elem.visitorTeamName.trim())
            : elem.visitorTeamName.trim(),
        awayTeam:
          getHomeTeamName(elem.visitorTeamName.trim()) !== ''
            ? getHomeTeamName(elem.visitorTeamName.trim())
            : elem.visitorTeamName.trim(),
        date: todayString,
        predictionDate: `morph hits ${elem.hits}`,
      });
    });

  // await axios
  //   .request(optionsHomeWin)
  //   .then(function (response) {
  //     console.log('response.optionsHomeWin', response.data);
  //     const data = response.data;

  //     data.length !== 0 &&
  //       data.forEach((elem) => {
  //         winData.push({
  //           source: 'morph',
  //           action: 'win',
  //           homeTeam:
  //             getHomeTeamName(elem.localTeamName.trim()) !== ''
  //               ? getHomeTeamName(elem.localTeamName.trim())
  //               : elem.localTeamName.trim(),
  //           prediction:
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
  //   .request(optionsAwayWin)
  //   .then(function (response) {
  //     console.log('response.optionsAwayWin', response.data);
  //     const data = response.data;

  //     data.length !== 0 &&
  //       data.forEach((elem) => {
  //         winData.push({
  //           source: 'morph',
  //           action: 'win',
  //           homeTeam:
  //             getHomeTeamName(elem.localTeamName.trim()) !== ''
  //               ? getHomeTeamName(elem.localTeamName.trim())
  //               : elem.localTeamName.trim(),
  //           prediction:
  //             getHomeTeamName(elem.visitorTeamName.trim()) !== ''
  //               ? getHomeTeamName(elem.visitorTeamName.trim())
  //               : elem.visitorTeamName.trim(),
  //           awayTeam:
  //             getHomeTeamName(elem.visitorTeamName.trim()) !== ''
  //               ? getHomeTeamName(elem.visitorTeamName.trim())
  //               : elem.visitorTeamName.trim(),
  //           date: todayString,
  //           predictionDate: `morph hits ${elem.hits}`,
  //         });
  //       });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
};

module.exports = { scrapeWinDataMorph };
