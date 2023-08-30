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

// const over25 = [];

const url_accum =
    'https://footyaccumulators.com/football-tips/over-2-5-trebles';
 // ACCUM
 await axios(url_accum)
 .then((response) => {
   const html = response.data;
   // console.log('000', html);
   const $ = cheerio.load(html);
   const accumArr = [];

   const classArr = [];
   const elemClass = $('div');
   console.log('elemClass',elemClass);
   
   classArr.push(elemClass);

   console.log('classArr',classArr);

  //  $('.zWPB', html).each(function () {
  //    const accumElem = $(this).find('div:first').text();
  //    const accumDate = $(this).find('.date').text();
  //    // console.log('accumDate', accumDate);
  //    accumArr.push({ team: accumElem, predictionDate: accumDate });
  //  });
  //  // console.log('accumArr', accumArr);
  //  for (let i = 0; i < accumArr.length - 1; i++) {
  //    let accumObj = {
  //      source: 'accum',
  //      action: 'over25',
  //      checked: false,
  //      homeTeam: '',
  //      date: todayString,
  //      predictionDate: '',
  //    };

  //    if (i === 0 || i % 2 === 0) {
  //      // accumObj.homeTeam = accumArr[i].team.trim();
  //      accumObj.homeTeam =
  //        getHomeTeamName(accumArr[i].team.trim()) !== ''
  //          ? getHomeTeamName(accumArr[i].team.trim())
  //          : accumArr[i].team.trim();
  //      accumObj.predictionDate = accumArr[i + 1].predictionDate;
  //    }
  //    // console.log('accumArr[i]', accumArr[i]);
  //    // console.log('accumObj', accumObj);
  //    accumObj.homeTeam !== '' && over25.push(accumObj);


  //  res.send('accum over loaded');
  // console.log('over25',over25);
 })
 .catch((err) => console.log(err));


  
  
};

module.exports = { scrapeOverTest };
