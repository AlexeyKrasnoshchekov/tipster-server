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
const { TodayBetArr } = require('./mongo_schema/TodayBetArr');
const { scrapeBtts } = require('./utils/scrapeBtts');
const { scrapeResults } = require('./utils/scrapeResults');
const { scrapeOver25 } = require('./utils/scrapeOver25');
const { scrapeClubStat } = require('./utils/scrapeClubStat');
const { scrapeWinData } = require('./utils/scrapeWinData');
const { WinData } = require('./mongo_schema/winDataModel');
mongoose.set('strictQuery', true);

///////////////////////////////////Get Data
let results = [];
let allData = [];
let winData = [];

const scrapeAndSaveData = async () => {
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
      if (
        sortedBtts[start].action === sortedBtts[next].action &&
        sortedBtts[start].source === sortedBtts[next].source
      ) {
        sortedBtts.splice(next, 1);
      }
    }

    start++;
    next++;
  }

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
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

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await Result.insertMany(results)
    .then(function () {
      console.log('Results inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
};
const scrapeAndSaveWinData = async function (req, res) {
  await scrapeWinData(winData);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await WinData.insertMany(winData)
    .then(function () {
      console.log('winData inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
};

const deleteRawResults = async function (req, res) {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await Result.deleteMany({ date: yesterdayString });

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

  await Btts.deleteMany({ date: todayString });
  console.log('Btts deleted'); // Success
  await db.disconnect();
};
const deleteWinDataByDate = async function (req, res) {
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

  await WinData.deleteMany({ date: todayString });
  console.log('WinData deleted'); // Success
  await db.disconnect();
};
const deleteTodayBetByDate = async function (req, res) {
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

  // console.log('todayString', todayString);

  await TodayBet.deleteMany({ date: todayString });
  console.log('TodayBets deleted'); // Success
  await db.disconnect();
};

const saveResultsTotal = async function (req, res) {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const bttsArr = await Btts.find({ date: yesterdayString });
  const resultsArr = await Result.find({ date: yesterdayString });

  let resultsTotal = [];

  for (let i = 0; i < resultsArr.length; i++) {
    for (let j = 0; j < bttsArr.length; j++) {
      if (
        resultsArr[i].homeTeam === bttsArr[j].homeTeam ||
        bttsArr[j].homeTeam.includes(resultsArr[i].homeTeam) ||
        resultsArr[i].homeTeam.includes(bttsArr[j].homeTeam) ||
        resultsArr[i].homeTeam === utils.getHomeTeamName(bttsArr[j].homeTeam)
      ) {
        let totalElemObj = {
          homeTeam: '',
          awayTeam: '',
          score: '',
          source: '',
          prediction: '',
          date: yesterdayString,
          bttsRes: false,
          over05Res: false,
          over15Res: false,
          over25Res: false,
        };

        totalElemObj.homeTeam = resultsArr[i].homeTeam;
        totalElemObj.awayTeam = bttsArr[j].awayTeam;
        totalElemObj.score = resultsArr[i].score;
        totalElemObj.source = bttsArr[j].source;
        totalElemObj.prediction = bttsArr[j].action;
        totalElemObj.bttsRes =
          parseInt(resultsArr[i].score.split(' - ')[0]) > 0 &&
          parseInt(resultsArr[i].score.split(' - ')[1]) > 0;
        totalElemObj.over05Res =
          parseInt(resultsArr[i].score.split(' - ')[0]) +
            parseInt(resultsArr[i].score.split(' - ')[1]) >
          0;
        totalElemObj.over15Res =
          parseInt(resultsArr[i].score.split(' - ')[0]) +
            parseInt(resultsArr[i].score.split(' - ')[1]) >
          1;
        totalElemObj.over25Res =
          parseInt(resultsArr[i].score.split(' - ')[0]) +
            parseInt(resultsArr[i].score.split(' - ')[1]) >
          2;

        resultsTotal.push(totalElemObj);
        // console.log('totalElemObj', totalElemObj);
      }
    }
  }
  await ResultTotal.insertMany(resultsTotal)
    .then(function () {
      console.log('ResultsTotal inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  await db.disconnect();
};

const jobScrapeAndSaveData = schedule.scheduleJob(
  { hour: 8, minute: 55 },
  scrapeAndSaveData
);
const jobScrapeAndSaveWinData = schedule.scheduleJob(
  { hour: 8, minute: 53 },
  scrapeAndSaveWinData
);
const jobScrapeAndSaveResults = schedule.scheduleJob(
  { hour: 8, minute: 51 },
  scrapeAndSaveResults
);



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
  await db.disconnect();

  res.json(bttsArr);
});
app.get('/getWinDataMongo', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const winDataArr = await WinData.find({ date: req.query.date });
  await db.disconnect();

  res.json(winDataArr);
});
app.get('/getFootyClubStat', async (req, res) => {
  const clubStat = {
    homeTeam: req.query.club,
    goalsAVG: '',
    bttsProb: '',
    over25Prob: '',
  };
  await scrapeClubStat(clubStat, req.query.club);

  console.log('clubStat', clubStat);

  res.json(clubStat);
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

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const resultsArr = await Result.find({ date: req.query.date });
  await db.disconnect();

  res.json(resultsArr);
});
app.get('/getTodayBetMongo', async (req, res) => {

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const todayBet = await TodayBet.find({ date: req.query.date });
  await db.disconnect();

  res.json(todayBet);
});
app.get('/getTodayBetArrMongo', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const todayBetArr = await TodayBetArr.find({ date: req.query.date });
  await db.disconnect();

  res.json(todayBetArr);
});

app.post('/saveTodayBetArrMongo', async (req, res) => {
  console.log('req.body', req.body);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  let tBetArr = await new TodayBetArr(req.body);
  await tBetArr.save(function (err) {
    if (err) return console.error(err);
    console.log('arr saved succussfully!');
  });

  // await data.length > 0 && TodayBetArr.insertMany(data);
  // // // console.log('resultsArr', resultsArr);
  await db.disconnect();
  // console.log('today bet inserted');
  res.json('today bet arr inserted');
});
app.post('/saveTodayBetMongo', async (req, res) => {
  // console.log('req.query.date', req.query.data);
  // const date = req.query.date;
  console.log('req.body', req.body);

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
  let tBet = await new TodayBet(req.body);
  await tBet.save(function (err) {
    if (err) return console.error(err);
    console.log('saved succussfully!');
  });
  // // // console.log('resultsArr', resultsArr);
  await db.disconnect();
  // console.log('today bet inserted');
  res.json('today bet inserted');
});
app.post('/savePredMongo', async (req, res) => {
  // console.log('req.query.date', req.query.data);
  // const date = req.query.date;
  console.log('req.body', req.body);
  let data = req.body;

  if (data.homeTeam.length !== 0) {
    data.homeTeam.forEach(async (elem) => {
      const newBttsObj = {
        source: data.source,
        action: data.action,
        homeTeam: elem,
        date: data.date,
      };

      mongoose.connect(
        'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          // useCreateIndex: true,
          useUnifiedTopology: true,
        }
      );
      let newBtts = await new Btts(newBttsObj);
      await newBtts.save(function (err) {
        if (err) return console.error(err);
        
      });
    
      await db.disconnect();


    });
    console.log('new preds saved succussfully!');
  }

 
  // console.log('today bet inserted');
  res.json('new preds inserted');
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
