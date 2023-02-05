const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const db = require('./db');
// const Btts = require("./mongo_schema/Btts");
const mongoose = require('mongoose');
const { Btts } = require('./mongo_schema/Result');
mongoose.set('strictQuery', true);

/////////// Mongo Model Schema
// const { Schema } = mongoose;

// const bttsSchema = new Schema(
//   {
//     source: { type: String, required: true },
//     action: { type: String, required: true },
//     homeTeam: { type: String, required: true },
//     awayTeam: { type: String, required: false },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Btts = mongoose.models?.Btts || mongoose.model('Btts', bttsSchema);

// Btts model
// const Btts = mongoose.model(
//   'Btts',
//   new mongoose.Schema(
//     {
//       source: { type: String, required: true },
//       action: { type: String, required: true },
//       homeTeam: { type: String, required: true },
//       awayTeam: { type: String, required: false },
//     },
//     {
//       timestamps: true,
//     }
//   )
// );

///////////////////////////////

////Get Data
const btts = [];

const scrapeData = async function (req, res) {
  const url_fbp =
    'https://footballpredictions.net/btts-tips-both-teams-to-score-predictions';
  const url_accum = 'https://footyaccumulators.com/football-tips/btts';
  const url_fst = 'https://www.freesupertips.com/free-football-betting-tips/';
  const url_footy = 'https://footystats.org/predictions/btts';
  const url_fbpai =
    'https://footballpredictions.ai/football-predictions/btts-predictions/';

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
        btts.push({
          source: 'fbp',
          action: 'btts',
          homeTeam,
          awayTeam,
        });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //Footy
  await axios(url_footy)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.betHeader', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const homeTeam = $(this).find('.betHeaderTitle').text().split(' vs ')[0];
        let homeTeam1 = '';
        if (homeTeam.includes('Yes')) {
          homeTeam1 = homeTeam.split('BTTS Yes ')[1];
        }
        const awayTeam = $(this).find('.betHeaderTitle').text().split(' vs ')[1];
        homeTeam1 !=='' && btts.push({
          source: 'footy',
          action: 'btts',
          homeTeam: homeTeam1,
          awayTeam,
        });
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //Fbpai
  await axios(url_fbpai)
    .then((response) => {
      const html = response.data;

      // console.log('000', html);
      const $ = cheerio.load(html);

      $('.footgame', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();

        const isBttsFbpai = $(this).find('.match-tip-show').text();

        if (isBttsFbpai === 'Yes') {
          const homeTeam = $(this)
            .find('a:first')
            .attr("title")
            .split(' - ')[0];
          const awayTeam = $(this)
          .find('a:first')
          .attr("title")
          .split(' - ')[1];
          btts.push({
            source: 'fbpai',
            action: 'btts',
            homeTeam,
            awayTeam,
          });
        }
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //ACCUM
  await axios(url_accum)
    .then((response) => {
      const html = response.data;
      // console.log('000', html);
      const $ = cheerio.load(html);
      const accumArr = [];

      $('.zWPB', html).each(function () {
        const accumElem = $(this).find('div:first').text();
        accumArr.push(accumElem);
      });

      for (let i = 0; i < accumArr.length - 1; i++) {
        let accumObj = {
          source: 'accum',
          action: 'btts',
          homeTeam: '',
        };

        if (i === 0 || i % 2 === 0) {
          accumObj.homeTeam = accumArr[i];
          // console.log('accumArr[i]', accumArr[i]);
        }

        accumObj.homeTeam !== '' && btts.push(accumObj);
      }

      // return res.send({ message: 'seeded successfully' });
      // res.json(btts);
    })
    .catch((err) => console.log(err));
  //FST
  await axios(url_fst)
    .then((response) => {
      const html = response.data;
      // const btts = [];
      const $ = cheerio.load(html);

      $('.Leg__title', html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        const isBttsFst = $(this).find('.Leg__win').text();
        let homeTeam = '';
        let awayTeam = '';
        if (isBttsFst === 'Both Teams To Score') {
          homeTeam = $(this).find('.Leg__lose').text().split('vs')[0];
          awayTeam = $(this).find('.Leg__lose').text().split('vs')[1];
          btts.push({
            source: 'fst',
            action: 'btts',
            homeTeam,
            awayTeam,
          });
        }
      });

      // res.json(btts);
    })
    .catch((err) => console.log(err));

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );
  // Function call
  console.log('btts', btts);
  await Btts.insertMany(btts)
    .then(function () {
      console.log('Data inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  await db.disconnect();
};

// const saveDataMongo = async function (req, res, next) {
//   console.log('saveDataMongo', btts);
//   // Database connection

//   res.json('inserted');
//   next();
// };

// app.use(scrapeData);
const job = schedule.scheduleJob({ hour: 9, minute: 30 }, scrapeData);
// const job = schedule.scheduleJob('28 * * * *', scrapeData);
// app.use(saveDataMongo);

// app.use(bodyParser.json());

app.use(cors());

///////APIS

app.get('/', function (req, res) {
  res.json('This is my webscraper');
});

// app.get('/getBtts', (req, res) => {
//   // db.connect();
//   // const bttsArr = Btts.find({});
//   // db.disconnect();

//   res.json(btts);
// });
app.get('/getBttsMongo1', async (req, res) => {
  await db.connect();
  const bttsArr = await Btts.find({});
  // await Btts.deleteMany();
  // console.log('bttsArr', bttsArr);
  await db.disconnect();

  res.json(bttsArr);
});
// app.post('/saveBtts', (req, res) => {
//   console.log('req.body', req.body.data);
//   let data = req.body.data;

//   db.connect();
//   Btts.insertMany(data);
//   db.disconnect();

//   res.end('saved');
// });
// app.get('/getFbpBtts', (req, res) => {});
// app.get('/getAccumBtts', (req, res) => {});
// app.get('/getFstBtts', (req, res) => {});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
