const axios = require('axios');
const cheerio = require('cheerio');
const { ProxyCrawlAPI } = require('proxycrawl');
const api1 = new ProxyCrawlAPI({ token: 'IpErJSu5VcdhkKqgLRJiwQ' });
const fns = require('date-fns');
const { getHomeTeamName } = require('../utils');

const scrapeOverTest = async function (over25) {

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
//   const url_suresoccer = 'https://www.suresoccerpredict.com/direct-win-prediction/';
// const url_bettingtips = 'https://www.bettingtips.today/football-accumulators-tips/';

const url_betgenuine_acc = 'https://betgenuine.com/bet-of-the-day/';
 //Betgenuine_Acc
 await axios(url_betgenuine_acc)
 .then((response) => {
   const html = response.data;

   // console.log('000', html);
   const $ = cheerio.load(html);

  //  $('.bdt-tabs-area', html).each(function () {
    //  const todayTab = $(this).data('content-id');
     const divsWithAttribute = $('div[data-content-id="today"]');

     console.log('divsWithAttribute', divsWithAttribute);

     if (divsWithAttribute) {
       $('tr', divsWithAttribute).each(function () {
         //<-- cannot be a function expression
         // const title = $(this).text();
         const homeTeam = $(this).find('td:nth-child(2)').text();
         const awayTeam = $(this).find('td:nth-child(4)').text();

         console.log('000', homeTeam);

         const tip = $(this).find('td:nth-child(5)').text();

        //  homeTeam &&
        //    homeTeam !== '' &&
        //    awayTeam &&
        //    awayTeam !== '' &&
        //    winData.push({
        //      source: 'betgenuine',
        //      action: tip.includes('X') ? 'XWin' : 'Win',
        //      checked: false,
        //      isAcca: true,
        //      homeTeam:
        //        getHomeTeamName(homeTeam.trim()) !== ''
        //          ? getHomeTeamName(homeTeam.trim())
        //          : homeTeam.trim(),
        //      awayTeam:
        //        getHomeTeamName(awayTeam.trim()) !== ''
        //          ? getHomeTeamName(awayTeam.trim())
        //          : awayTeam.trim(),
        //      date: todayString,
        //      prediction: tip.includes('1') ? homeTeam : awayTeam,
        //    });
       });
     }
  //  });

   // res.json(over25);
 })
 .catch((err) => console.log(err));


  
  
};

module.exports = { scrapeOverTest };
