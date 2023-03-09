const axios = require('axios');
const cheerio = require('cheerio');
// const fns = require('date-fns');
const { getFootyClubLink } = require('../utils');

const scrapeClubStat = async function (clubStat, club) {
  const url = 'https://footystats.org/clubs/';
  let url2 = '';

  const today = new Date();
  const day = today.getDate();
  console.log('day', day);
  // let month = today.getMonth();
  // month = month < 10 ? `0${month + 1}` : month + 1;
  // const yesterday = new Date(today);

  // yesterday.setDate(yesterday.getDate() - 1);
  // const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  // const yesterdayString = formattedYesterday.toString();
  const clubRoute = getFootyClubLink(club);
  if (clubRoute !== '') {
    url2 = url + clubRoute;
    console.log('url2', url2);
  } else {
    console.log('ссылка на клуб ПУСТА, добавь в utils');
  }
  //result2
  await axios(url2)
    .then((response) => {
      const html = response.data;
      // console.log('html', html);
      const $ = cheerio.load(html);

      $('.matchHistoryEvent', html).each(function () {
        // const homeTeam = $(this).find('incomplete:first').find('.homeTeamInfo').text();
        
        const matchDate = $(this).find('.matchDate').find('.monthAndDay').text();
        const goalsAVG = $(this).find('.stats').find('li:first').find('span').text();
        console.log('goalsAVG', goalsAVG);
        const bttsProb = $(this).find('.stats').find('li:nth-child(2)').find('span').text();
        console.log('bttsProb', bttsProb);
        const over25Prob = $(this).find('.stats').find('li:nth-child(3)').find('span').text();
        console.log('over25Prob', over25Prob);
        
        if (day.toString() === matchDate.split(' ')[1] && goalsAVG !=='' && bttsProb !=='' && over25Prob !=='') {
          console.log('day2', day);
          clubStat.goalsAVG = goalsAVG;
          clubStat.bttsProb = bttsProb;
          clubStat.over25Prob = over25Prob;
          return;

        }

        // const score = $(this).find('sc:first').text();

        // if (
        //   score !== '' &&
        //   awayTeam !== '' &&
        //   homeTeam !== '' &&
        //   yesterdayString !== ''
        // ) {
        //   results.push({
        //     score,
        //     homeTeam: homeTeam.trim(),
        //     awayTeam,
        //     date: yesterdayString,
        //   });
        // }
      });
    })
    .catch((err) => console.log(err));
};

module.exports = { scrapeClubStat };
