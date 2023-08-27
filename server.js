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
const { WinData } = require('./mongo_schema/winDataModel');
const { Under25 } = require('./mongo_schema/Under25');

const { scrapeBtts } = require('./utils/scrapeBtts');
const { scrapeResults } = require('./utils/scrapeResults');
const { scrapeOver25 } = require('./utils/scrapeOver25');
const { scrapeOverTest } = require('./utils/scrapeOverTest');
const { scrapeMorphTotals } = require('./utils/scrapeMorphTotals');
const { scrapeClubStat } = require('./utils/scrapeClubStat');
const { scrapeWinData } = require('./utils/scrapeWinData');
const { scrapeCrawlDataOther } = require('./utils/scrapeCrawlData');
const { scrapeWinDataMorph } = require('./utils/scrapeWinDataMorph');
const { scrapeUnder25 } = require('./utils/scrapeUnder25');
const { Acca } = require('./mongo_schema/Acca');
const { Team } = require('./mongo_schema/Team');

mongoose.set('strictQuery', true);

///////////////////////////////////Get Data
let results = [];
let allData = [];
let under25Data = [];
let allDataMorph = [];
let winData = [];
let dataCrawl = [];
let winDataMorph = [];

const scrapeAndSaveUnder25Data = async () => {
  await scrapeUnder25(under25Data);

  let start = 0;
  let next = 1;
  let sortedUnder25 = under25Data.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  //удаление дублей
  while (next < sortedUnder25.length) {
    if (
      sortedUnder25[start].homeTeam.trim() === sortedUnder25[next].homeTeam.trim()
    ) {
      if (
        sortedUnder25[start].action === sortedUnder25[next].action &&
        sortedUnder25[start].source === sortedUnder25[next].source
      ) {
        sortedUnder25.splice(next, 1);
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

  await Under25.insertMany(sortedUnder25)
    .then(function () {
      console.log('Under25 inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
}

const scrapeAndSaveData = async () => {
  await scrapeBtts(allData);

  await scrapeOver25(allData);

  // await scrapeOverTest(allData);
  
  

  // console.log('allData',allData);

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

  // sortedBtts = sortedBtts.forEach(elem => {
  //   elem.homeTeam = utils.getHomeTeamName(elem.homeTeam);
  // })

  await Btts.insertMany(sortedBtts)
    .then(function () {
      console.log('Btts inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
};
const scrapeAndSaveDataMorph = async () => {

  await scrapeMorphTotals(allDataMorph);

  let sortedMorph = allDataMorph.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });


  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await Btts.insertMany(sortedMorph)
    .then(function () {
      console.log('Btts Morph inserted'); // Success
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

  results = results.map(result => {
    result.homeTeam = utils.formatHomeTeamName(result.homeTeam);
    result.awayTeam = utils.formatHomeTeamName(result.awayTeam);

    result.homeTeam = utils.getHomeTeamName(result.homeTeam);
    result.awayTeam = utils.getHomeTeamName(result.awayTeam);


    return result;
  }) 
  console.log('results111',results);
  // let teams = [];
  // const teams1 = results.map(result => {
  //   let obj = {name: result.homeTeam};
  //   return obj;
  // });
  // const teams2 = results.map(result => {
  //   let obj = {name: result.awayTeam};
  //   return obj;
  // });
  // teams = teams.concat(teams1).concat(teams2);

  // const teamsMongo = await Team.find({});
  // const uniqueArr = [];

  // console.log('teams',teams);

  // if (teamsMongo.length > 0) {
  //   for(let team of teams) {
  //     if(teamsMongo.indexOf(team) === -1) {
  //         uniqueArr.push(team.trim());
  //     }
  //   }
  // } else {
  //   await Team.insertMany(teams)
  //     .then(function () {
  //       console.log('teams inserted'); // Success
  //     })
  //     .catch(function (error) {
  //       console.log(error); // Failure
  //     });
  // }

  

  await Result.insertMany(results)
    .then(function () {
      console.log('Results inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

    // if (uniqueArr.length > 0) {
    //   await Team.insertMany(uniqueArr)
    //   .then(function () {
    //     console.log('unique teams inserted'); // Success
    //   })
    //   .catch(function (error) {
    //     console.log(error); // Failure
    //   });
    // }

    // const teamsMongo2 = await Team.find({});
    // console.log('teamsMongo2',teamsMongo2);

  await db.disconnect();
};
const scrapeAndSaveWinData = async function (req, res) {
  await scrapeWinData(winData);

  // await scrapeOverTest(allData);



  await scrapeCrawlDataOther(dataCrawl);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await Btts.insertMany(winData)
  //   .then(function () {
  //     console.log('winData inserted'); // Success
  //   })
  //   .catch(function (error) {
  //     console.log(error); // Failure
  //   });

  // winData = winData.forEach(elem => {
  //   elem.homeTeam = utils.getHomeTeamName(elem.homeTeam);
  //   return;
  // })

  await WinData.insertMany(winData)
    .then(function () {
      console.log('winDataOther inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  const winDataCrawl = dataCrawl.filter(item => item.action === 'win');

  // winDataCrawl = winDataCrawl.forEach(elem => {
  //   elem.homeTeam = utils.getHomeTeamName(elem.homeTeam);
  //   return;
  // })

  await WinData.insertMany(winDataCrawl)
    .then(function () {
      console.log('winDataCrawl inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

    const overDataCrawl = dataCrawl.filter(item => (item.action === 'btts' || item.action === 'over25'));
    await Btts.insertMany(overDataCrawl)
    .then(function () {
      console.log('crawl Btts inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await db.disconnect();
};
const scrapeAndSaveWinDataMorph = async function (req, res) {
  await scrapeWinDataMorph(winDataMorph);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // winDataMorph = winDataMorph.forEach(elem => {
  //   elem.homeTeam = utils.getHomeTeamName(elem.homeTeam);
  //   return;
  // })

    await WinData.insertMany(winDataMorph)
    .then(function () {
      console.log('winDataOther inserted'); // Success
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
const deleteUnder25ByDate = async function (req, res) {
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

  await Under25.deleteMany({ date: todayString });
  console.log('Under25 deleted'); // Success
  await db.disconnect();
};
const deleteResultsTotalByDate = async function (req, res) {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await ResultTotal.deleteMany({ date: yesterdayString });
  console.log('ResultTotal deleted'); // Success
  await db.disconnect();
};
const deleteResultsByDate = async function (req, res) {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await Result.deleteMany({ date: yesterdayString });
  console.log('Result deleted'); // Success
  await db.disconnect();
};
const deleteTeamsByDate = async function (req, res) {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = fns.format(yesterday, 'dd.MM.yyyy');
  const yesterdayString = formattedYesterday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await Team.deleteMany({ date: yesterdayString });
  console.log('Teams deleted'); // Success
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

  let bttsArr = await Btts.find({ date: yesterdayString });
  let sortedBtts = bttsArr.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });
  let resultsArr = await Result.find({ date: yesterdayString });
  let sortedResults = resultsArr.sort((a, b) => {
    if (a.homeTeam < b.homeTeam) {
      return -1;
    }
    if (a.homeTeam > b.homeTeam) {
      return 1;
    }
    return 0;
  });

  // console.log('sortedBtts', sortedBtts)
  // console.log('sortedResults', sortedResults)

  let resultsTotal = [];

  for (let i = 0; i < sortedResults.length; i++) {
    for (let j = 0; j < sortedBtts.length; j++) {

      // const longestSubstring = utils.LCSubStr(sortedResults[i].homeTeam, sortedBtts[j].homeTeam, sortedResults[i].homeTeam.length ,sortedBtts[j].homeTeam.length );

      // console.log('111', longestSubstring)
      // console.log('222', (longestSubstring / sortedResults[i].homeTeam.length))
      // console.log('222', bttsArr[0].homeTeam)
      // console.log('333', utils.LCSubStr(resultsArr[2].homeTeam,bttsArr[0].homeTeam, resultsArr[2].homeTeam.length ,bttsArr[0].homeTeam.length ))
      if (
        resultsArr[i].homeTeam === bttsArr[j].homeTeam ||
        // sortedResults[i].homeTeam.length === sortedBtts[j].homeTeam.length && sortedBtts[j].homeTeam.length === utils.LCSubStr(sortedResults[i].homeTeam,sortedBtts[j].homeTeam, sortedResults[i].homeTeam.length ,sortedBtts[j].homeTeam.length ) ||
        // (longestSubstring / sortedResults[i].homeTeam.length)*100 >= 45
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

  // console.log('resultsTotal', resultsTotal)
  await ResultTotal.insertMany(resultsTotal)
    .then(function () {
      console.log('ResultsTotal inserted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  await db.disconnect();
};

//MAIN DATA
const jobScrapeAndSaveData = schedule.scheduleJob(
  { hour: 11, minute: 22  },
  scrapeAndSaveData
);

const jobScrapeAndSaveWinData = schedule.scheduleJob(
  { hour: 11, minute: 27 },
  scrapeAndSaveWinData
);

//MORPH DATA
const jobScrapeAndSaveWinDataMorph = schedule.scheduleJob(
  { hour: 11, minute: 25 },
  scrapeAndSaveWinDataMorph
);
const jobScrapeAndSaveDataMorph = schedule.scheduleJob(
  { hour: 11, minute: 04 },
  scrapeAndSaveDataMorph
);

//UNDER DATA
// const jobScrapeAndSaveUnderData = schedule.scheduleJob(
//   { hour: 14, minute: 01 },
//   scrapeAndSaveUnder25Data
// );


//RESULTS DATA
const jobScrapeAndSaveResults = schedule.scheduleJob(
  { hour: 11, minute: 26 },
  scrapeAndSaveResults
);
// const jobScrapeAndSaveResultsTotal = schedule.scheduleJob(
//   { hour: 14, minute: 55 },
//   saveResultsTotal
// );



//DELETE DATA

// const jobDeleteBttsByDate = schedule.scheduleJob(
//   { hour: 9, minute: 31 },
//   deleteBttsByDate
// );
// const jobDeleteWinDataByDate = schedule.scheduleJob(
//   { hour: 9, minute: 49 },
//   deleteWinDataByDate
// );
// const jobDeleteUnder25ByDate = schedule.scheduleJob(
//   { hour: 12, minute: 11 },
//   deleteUnder25ByDate
// );
// const jobDeleteResultsTotalByDate = schedule.scheduleJob(
//   { hour: 15, minute: 19 },
//   deleteResultsTotalByDate
// );
// const jobDeleteResultsByDate = schedule.scheduleJob(
//   { hour: 15, minute: 22 },
//   deleteResultsByDate
// );
// const jobDeleteTeamsByDate = schedule.scheduleJob(
//   { hour: 15, minute: 19 },
//   deleteTeamsByDate
// );




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
  await db.disconnect();

  res.json(bttsArr);
});
app.get('/scrapeMorph', async (req, res) => {

  console.log('scrapeMorph');

  
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
app.get('/predictions', async (req, res) => {
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
app.get('/getAccasMongo', async (req, res) => {

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const accasArr = await Acca.find({ date: req.query.date });
  await db.disconnect();

  res.json(accasArr);
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

app.post('/saveTodayBetMongo', async (req, res) => {
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  let tBet = await new TodayBet(req.body);
  await tBet.save(function (err) {
    if (err) return console.error(err);
    console.log('saved succussfully!');
  });
  await db.disconnect();
  res.json('today bet inserted');
});
app.post('/saveBttsMongo', async (req, res) => {
  let data = req.body;
  console.log('dataPred', data);
  if (data.homeTeam.length !== 0) {
    data.homeTeam.forEach(async (elem) => {
      const newBttsObj = {
        source: data.source,
        action: data.action,
        homeTeam: utils.getHomeTeamName(elem) !=='' ? utils.getHomeTeamName(elem) : elem,
        predTeam: utils.getHomeTeamName(data.predTeam) !=='' ? utils.getHomeTeamName(data.predTeam) : data.predTeam,
        date: data.date,
        isAcca: data.isAcca
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
        console.log('new pred saved succussfully!');
      });
    
      await db.disconnect();


    });
    console.log('new Over saved succussfully!');
  }

  res.json('new preds inserted');
});
app.post('/saveUnderMongo', async (req, res) => {
  let data = req.body;
  console.log('dataPred', data);
  if (data.homeTeam.length !== 0) {
    data.homeTeam.forEach(async (elem) => {
      const newBttsObj = {
        source: data.source,
        action: data.action,
        homeTeam: utils.getHomeTeamName(elem) !=='' ? utils.getHomeTeamName(elem) : elem,
        predTeam: utils.getHomeTeamName(data.predTeam) !=='' ? utils.getHomeTeamName(data.predTeam) : data.predTeam,
        date: data.date,
        isAcca: data.isAcca
      };

      mongoose.connect(
        'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          // useCreateIndex: true,
          useUnifiedTopology: true,
        }
      );
      let newUnder = await new Under25(newBttsObj);
      await newUnder.save(function (err) {
        if (err) return console.error(err);
        console.log('new Under saved succussfully!');
      });
    
      await db.disconnect();


    });
    console.log('new preds saved succussfully!');
  }

  res.json('new preds inserted');
});
app.post('/saveWinMongo', async (req, res) => {
  let data = req.body;
  console.log('dataPred', data);
  if (data.homeTeam.length !== 0) {
    data.homeTeam.forEach(async (elem) => {
      const newWinObj = {
        source: data.source,
        action: data.action,
        homeTeam: utils.getHomeTeamName(elem) !=='' ? utils.getHomeTeamName(elem) : elem,
        prediction: utils.getHomeTeamName(data.prediction) !=='' ? utils.getHomeTeamName(data.prediction) : data.prediction,
        date: data.date,
        isAcca: data.isAcca
      };

      mongoose.connect(
        'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          // useCreateIndex: true,
          useUnifiedTopology: true,
        }
      );
      let newWin = await new WinData(newWinObj);
      await newWin.save(function (err) {
        if (err) return console.error(err);
        console.log('new Win saved succussfully!');
      });
    
      await db.disconnect();


    });
    console.log('new preds saved succussfully!');
  }

  res.json('new preds inserted');
});
app.post('/saveAccaMongo', async (req, res) => {
  let data = req.body;
  console.log('dataPred', data);
  if (data.prediction.length !== 0) {
    data.prediction.forEach(async (elem) => {
      const newAccaObj = {
        source: data.source,
        action: data.action,
        // homeTeam: utils.getHomeTeamName(elem) !=='' ? utils.getHomeTeamName(elem) : elem,
        prediction: utils.getHomeTeamName(elem) !=='' ? utils.getHomeTeamName(elem) : elem,
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
      let newAcca = await new Acca(newAccaObj);
      await newAcca.save(function (err) {
        if (err) return console.error(err);
        console.log('new acca saved succussfully!');
      });
    
      await db.disconnect();


    });
    console.log('new accas saved succussfully!');
  }

  res.json('new accas inserted');
});
app.post('/predictions', async (req, res) => {
  let data = req.body;
  console.log('dataPred', data);
  if (data.homeTeam.length !== 0) {
    data.homeTeam.forEach(async (elem) => {
      const newBttsObj = {
        source: data.source,
        action: data.action,
        homeTeam: utils.getHomeTeamName(elem) !=='' ? utils.getHomeTeamName(elem) : elem,
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
        console.log('new pred saved succussfully!');
      });
    
      await db.disconnect();


    });
    console.log('new preds saved succussfully!');
  }

  res.json('new preds inserted');
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));

// Export the Express API
module.exports = app;
