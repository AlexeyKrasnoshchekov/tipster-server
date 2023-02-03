const scrapeFbpBtts = async (req, res, next) => {
  const fbpBtts = [];
  const url_fbp =
    'https://footballpredictions.net/btts-tips-both-teams-to-score-predictions';

  //FBP
  await axios(url_fbp)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.match-preview', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.home-team').find('.team-label').text();
        const awayTeam = $(this).find('.away-team').find('.team-label').text();
        fbpBtts.push({
          source: 'fbp',
          action: 'btts',
          homeTeam,
          awayTeam,
        });
      });

      res.json(fbpBtts);
    })
    .catch((err) => console.log(err));
};
