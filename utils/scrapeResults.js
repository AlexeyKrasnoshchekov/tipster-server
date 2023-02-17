const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');

const scrapeResults = async function (results) {
  const url_result2 = 'https://www.livescore.bz/en/yesterday/';

  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();

  //result2
  await axios(url_result2)
    .then((response) => {
      const html = response.data;

      const $ = cheerio.load(html);

      $('.m', html).each(function () {
        const homeTeam = $(this).find('t1:first').find('t:first').text();
        const awayTeam = $(this).find('t2:first').find('t:first').text();

        const score = $(this).find('sc:first').text();

        if (
          score !== '' &&
          awayTeam !== '' &&
          homeTeam !== '' &&
          yesterdayString !== ''
        ) {
          results.push({
            score,
            homeTeam: homeTeam.trim(),
            awayTeam,
            date: yesterdayString,
          });
        }
      });
    })
    .catch((err) => console.log(err));
};

module.exports = { scrapeResults };
