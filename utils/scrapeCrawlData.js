const axios = require('axios');
const cheerio = require('cheerio');
const { ProxyCrawlAPI } = require('proxycrawl');
const api1 = new ProxyCrawlAPI({ token: 'IpErJSu5VcdhkKqgLRJiwQ' });
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeCrawlDataOther = async function (crawlData) {
  const url_bettingtips = 'https://www.bettingtips.today/football-accumulators-tips/';
  const url_wincomparator = 'https://www.wincomparator.com/predictions/';

  // const url_fbpai =
  //   'https://footballpredictions.ai/football-predictions/1x2-predictions/';

  const today = new Date();
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const todayString = formattedToday.toString();

  const day = today.getDate();

  //Bettingtips
await api1.get(url_bettingtips)
.then((response) => {

  if (response.statusCode === 200 && response.originalStatus === 200) {
    // console.log('000', response.body);
    const html = response.body;
    const $ = cheerio.load(html);

    $('.diveachgame', html).each(function () {
      const pred = $(this).find('.icontip').find('span:first').text();


        const homeTeam = $(this).find('.dividehome').find('div:first').find('.teamtip').text();
        const awayTeam = $(this).find('.divideaway').find('div:first').find('.teamtip').text();

        if (homeTeam !== '' && pred.includes('Over')) {
          crawlData.push({
            source: 'bettingtips',
            action: 'over25',
            isAcca: true,
            homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
            awayTeam,
            date: todayString,
          });
        } else if (homeTeam !== '' && pred.includes('Yes')) {
          crawlData.push({
            source: 'bettingtips',
            action: 'btts',
            isAcca: true,
            homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
            awayTeam,
            date: todayString,
          });

        } else if (homeTeam !== '' && (pred.includes('1') || pred.includes('2'))) {
          crawlData.push({
            source: 'bettingtips',
            action: 'win',
            isAcca: true,
            homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
            awayTeam,
            date: todayString,
            prediction: pred.includes('1') ? homeTeam : awayTeam,
          });
        }
          
    });

  } else {
    console.log('Failed: ', response.statusCode, response.originalStatus);
  }

  // res.json(over25);
})
.catch((err) => console.log(err));

  //Wincomparator
await api1.get(url_wincomparator)
.then((response) => {

  if (response.statusCode === 200 && response.originalStatus === 200) {
    // console.log('000', response.body);
    const html = response.body;
    const $ = cheerio.load(html);

    $('.card', html).each(function () {
      const pred = $(this).find('.tips__event__tip__prono ').find('span:nth-child(2)').text();
      let date = $(this).find('.tips__event__tip__date').text();
      date = date.split('/')[0];


        const homeTeam = $(this).find('a:first').find('.break-words:first').text();
        const awayTeam = $(this).find('a:first').find('.break-words:nth-child(2)').text();

        if (date.includes(`${day}`)) {
          if (homeTeam !== '' && pred.includes('Over')) {
            crawlData.push({
              source: 'wincomparator',
              action: 'over25',
              isAcca: true,
              homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
          } else if (homeTeam !== '' && pred.includes('Both teams to score')) {
            crawlData.push({
              source: 'wincomparator',
              action: 'btts',
              isAcca: true,
              homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
              awayTeam,
              date: todayString,
            });
  
          } else if (homeTeam !== '' && pred.includes('Match Winner')) {
            crawlData.push({
              source: 'wincomparator',
              action: 'win',
              isAcca: true,
              homeTeam: getHomeTeamName(homeTeam.trim()) !=='' ? getHomeTeamName(homeTeam.trim()) : homeTeam.trim(),
              awayTeam,
              date: todayString,
              prediction: pred.includes(homeTeam) ? homeTeam : awayTeam,
            });
          }
        }
          
    });

  } else {
    console.log('Failed: ', response.statusCode, response.originalStatus);
  }

  // res.json(over25);
})
.catch((err) => console.log(err));

  

  

  // //Fbpai
  // await axios(url_fbpai)
  //   .then((response) => {
  //     const html = response.data;

  //     // console.log('000', html);
  //     const $ = cheerio.load(html);

  //     $('.footgame', html).each(function () {
  //       //<-- cannot be a function expression
  //       // const title = $(this).text();

  //       const isPred = $(this).find('.match-tip-show').text();

  //       if (isPred === '2' || isPred === '1') {
  //         const homeTeam = $(this)
  //           .find('.match-teams')
  //           .find('div:first')
  //           .text();
  //         const awayTeam = $(this)
  //           .find('.match-teams')
  //           .find('div:nth-child(2)')
  //           .text();
  //         homeTeam !== '' &&
  //           awayTeam !== '' &&
  //           winData.push({
  //             source: 'fbpai',
  //             action: 'win',
  //             checked: false,
  //             homeTeam:
  //               getHomeTeamName(homeTeam.trim()) !== ''
  //                 ? getHomeTeamName(homeTeam.trim())
  //                 : homeTeam.trim(),
  //             awayTeam:
  //               getHomeTeamName(awayTeam.trim()) !== ''
  //                 ? getHomeTeamName(awayTeam.trim())
  //                 : awayTeam.trim(),
  //             prediction:
  //               isPred === '1' && getHomeTeamName(homeTeam.trim()) !== ''
  //                 ? getHomeTeamName(homeTeam.trim())
  //                 : homeTeam.trim() | (isPred === '2') &&
  //                   getHomeTeamName(awayTeam.trim()) !== ''
  //                 ? getHomeTeamName(awayTeam.trim())
  //                 : awayTeam.trim(),
  //             date: todayString,
  //           });
  //       }
  //     });

  //     // res.json(over25);
  //   })
  //   .catch((err) => console.log(err));

  
};

module.exports = { scrapeCrawlDataOther };
