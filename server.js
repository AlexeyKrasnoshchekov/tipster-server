const PORT = 8000;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// import routes
const bttsRouter = require('./routes/btts');
const overRouter = require('./routes/over');
const crawlRouter = require('./routes/crawl');
const winRouter = require('./routes/win');
const resultRouter = require('./routes/result');
const totalRouter = require('./routes/total');
const underRouter = require('./routes/under');

// route middlewares
app.use('/btts', bttsRouter);
app.use('/over', overRouter);
app.use('/crawl', crawlRouter);
app.use('/win', winRouter);
app.use('/result', resultRouter);
app.use('/total', totalRouter);
app.use('/under', underRouter);

const db = require('./db');
const mongoose = require('mongoose');
const { Btts } = require('./mongo_schema/Btts');
const { Result } = require('./mongo_schema/Result');
const { ResultTotal } = require('./mongo_schema/ResultTotal');
const { WinData } = require('./mongo_schema/winDataModel');
const { Under25 } = require('./mongo_schema/Under25');

const { scrapeClubStat } = require('./utils/scrapeClubStat');

const { Over } = require('./mongo_schema/Over');

mongoose.set('strictQuery', true);


app.use(bodyParser.json());

app.use(cors());

///////APIS

app.get('/', function (req, res) {
  res.json('This is my webscraper');
});

app.get('/formatClubs', async (req, res) => {
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
  const overArr = await Over.find({ date: req.query.date });
  await db.disconnect();

  let allData = [];
  allData = allData.concat(bttsArr).concat(overArr);

  res.json(allData);
});

app.get('/getUnder25Mongo', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const under25Arr = await Under25.find({ date: req.query.date });
  await db.disconnect();

  res.json(under25Arr);
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
  console.log('resultsArr', resultsArr);
  await db.disconnect();

  res.json(resultsArr);
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

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));

// Export the Express API
module.exports = app;
