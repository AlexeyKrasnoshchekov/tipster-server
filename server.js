const PORT = 8000;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const fns = require('date-fns');

const db = require('./db');
const utils = require('./utils');
const mongoose = require('mongoose');
const { Btts } = require('./mongo_schema/Btts');
const { Result } = require('./mongo_schema/Result');
const { ResultTotal } = require('./mongo_schema/ResultTotal');
const { TodayBet } = require('./mongo_schema/TodayBet');
const { scrapeBtts } = require('./utils/scrapeBtts');
const { scrapeResults } = require('./utils/scrapeResults');
const { scrapeOver25 } = require('./utils/scrapeOver25');
mongoose.set('strictQuery', true);

///////////////////////////////////Get Data
let results = [];
let allData = [];

const scrapeAndSaveData = async function (req, res) {
  await scrapeBtts(allData);

  await scrapeOver25(allData);

  let start = 0;
  let next = 1;
  let sortedBtts = allData.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next < sortedBtts.length) {
    if (
      sortedBtts[start].homeTeam.trim() === sortedBtts[next].homeTeam.trim()
    ) {
      if (sortedBtts[start].action === sortedBtts[next].action && sortedBtts[start].source === sortedBtts[next].source) {
        sortedBtts.splice(next, 1);
      }
    }

    start++;
    next++;
  }

  // console.log('sortedBtts', sortedBtts);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await Btts.insertMany(sortedBtts)
    .then(function () {
      console.log('Btts inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });  

  await db.disconnect();
};
const scrapeAndSaveResults = async function (req, res) {
  await scrapeResults(results);

  console.log('resultsddd', results);

  await Result.insertMany(results)
    .then(function () {
      console.log('Results inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  
};

const deleteRawResults = async function (req, res) {
  const yesterday1 = new Date(new Date().setDate(new Date().getDate() - 2));

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  console.log('yesterday1', yesterday1);

  await Result.deleteMany({ Timestamp: { $gt: yesterday1 } });

  await db.disconnect();
};
const deleteBttsByDate = async function (req, res) {
  const today = new Date();
  const formattedToday = fns.format(today, 'dd.MM.yyyy');
  const todayString = formattedToday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  console.log('todayString', todayString);

  await Btts.deleteMany({ date: todayString });

  await db.disconnect();
};


const jobScrapeAndSaveData = schedule.scheduleJob({ hour: 11, minute: 57 }, scrapeAndSaveData);
const jobScrapeAndSaveResults = schedule.scheduleJob({ hour: 11, minute: 57 }, scrapeAndSaveResults);
// const jobSave = schedule.scheduleJob({ hour: 15, minute: 47 }, deleteBttsByDate);
// const jobSave = schedule.scheduleJob({ hour: 15, minute: 16 }, scrapeAndSaveOver25);

// const job = schedule.scheduleJob('07 * * * *', scrapeData);

// const job = schedule.scheduleJob('52 * * * *', saveResults);
// app.use(saveDataMongo);

app.use(bodyParser.json());

app.use(cors());







///////APIS






app.get('/', function (req, res) {
  res.json('This is my webscraper');
});

app.get('/getBttsMongo', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const bttsArr = await Btts.find({ date: req.query.date });
  // await Btts.deleteMany();
  // console.log('bttsArr', bttsArr);
  await db.disconnect();

  res.json(bttsArr);
});
app.get('/getResultsTotalMongo', async (req, res) => {

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const resultsArr = await ResultTotal.find({ date: req.query.date });

  await db.disconnect();

  res.json(resultsArr);
});
app.get('/deleteResultsTotalMongo', async (req, res) => {


  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await ResultTotal.deleteOne({ homeTeam: req.query.homeTeam });

  await db.disconnect();
  res.send({ message: 'ResultTotal Deleted' });
});
app.get('/getResultsMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const resultsArr = await Result.find({ date: req.query.date });
  await db.disconnect();

  res.json(resultsArr);
});
app.get('/getTodayBetMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const todayBet = await Result.find({ date: req.query.date });
  // const resultsArr = await Result.find({});
  // await Btts.deleteMany();
  // console.log('resultsArr', resultsArr);
  await db.disconnect();

  res.json(todayBet);
});
app.post('/saveStatMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;
  // console.log('req.body', req.body);

  let statObj = req.body;

  statObj.fbp.bttsMisPerc = (
    (100 * (statObj.fbp.total - statObj.fbp.bttsMisArr.length)) /
    statObj.fbp.total
  ).toFixed(2);
  statObj.fbp.over05MisPerc = (
    (100 * (statObj.fbp.total - statObj.fbp.over05MisArr.length)) /
    statObj.fbp.total
  ).toFixed(2);

  statObj.fst.bttsMisPerc = (
    (100 * (statObj.fst.total - statObj.fst.bttsMisArr.length)) /
    statObj.fst.total
  ).toFixed(2);
  statObj.fst.over05MisPerc = (
    (100 * (statObj.fst.total - statObj.fst.over05MisArr.length)) /
    statObj.fst.total
  ).toFixed(2);

  statObj.footy.bttsMisPerc = (
    (100 * (statObj.footy.total - statObj.footy.bttsMisArr.length)) /
    statObj.footy.total
  ).toFixed(2);
  statObj.footy.over05MisPerc = (
    (100 * (statObj.footy.total - statObj.footy.over05MisArr.length)) /
    statObj.footy.total
  ).toFixed(2);

  statObj.accum.bttsMisPerc = (
    (100 * (statObj.accum.total - statObj.accum.bttsMisArr.length)) /
    statObj.accum.total
  ).toFixed(2);
  statObj.accum.over05MisPerc = (
    (100 * (statObj.accum.total - statObj.accum.over05MisArr.length)) /
    statObj.accum.total
  ).toFixed(2);

  statObj.fbpai.bttsMisPerc = (
    (100 * (statObj.fbpai.total - statObj.fbpai.bttsMisArr.length)) /
    statObj.fbpai.total
  ).toFixed(2);
  statObj.fbpai.over05MisPerc = (
    (100 * (statObj.fbpai.total - statObj.fbpai.over05MisArr.length)) /
    statObj.fbpai.total
  ).toFixed(2);

  statObj.mighty.bttsMisPerc = (
    (100 * (statObj.mighty.total - statObj.mighty.bttsMisArr.length)) /
    statObj.mighty.total
  ).toFixed(2);
  statObj.mighty.over05MisPerc = (
    (100 * (statObj.mighty.total - statObj.mighty.over05MisArr.length)) /
    statObj.mighty.total
  ).toFixed(2);

  statObj.passion.bttsMisPerc = (
    (100 * (statObj.passion.total - statObj.passion.bttsMisArr.length)) /
    statObj.passion.total
  ).toFixed(2);
  statObj.passion.over05MisPerc = (
    (100 * (statObj.passion.total - statObj.passion.over05MisArr.length)) /
    statObj.passion.total
  ).toFixed(2);

  statObj.mybets.bttsMisPerc = (
    (100 * (statObj.mybets.total - statObj.mybets.bttsMisArr.length)) /
    statObj.mybets.total
  ).toFixed(2);
  statObj.mybets.over05MisPerc = (
    (100 * (statObj.mybets.total - statObj.mybets.over05MisArr.length)) /
    statObj.mybets.total
  ).toFixed(2);
  console.log('statObj', statObj);
  // mongoose.connect(
  //   'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
  //   {
  //     useNewUrlParser: true,
  //     // useCreateIndex: true,
  //     useUnifiedTopology: true,
  //   }
  // );
  // // const resultsArr = await Result.find({ date: req.query.date });
  // // // const resultsArr = await Result.find({});
  // await Stat.insertMany(statObj);
  // // // console.log('resultsArr', resultsArr);
  // await db.disconnect();
  // res.json('stat inserted');
});
app.post('/saveTodayBetMongo', async (req, res) => {
  // console.log('req.query.date', req.query.date);
  // const date = req.query.date;
  // console.log('req.body', req.body);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );
  // // const resultsArr = await Result.find({ date: req.query.date });
  // // // const resultsArr = await Result.find({});
  await TodayBet.save(req.body);
  // // // console.log('resultsArr', resultsArr);
  await db.disconnect();
  console.log('today bet inserted');
  res.json('today bet inserted');
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
