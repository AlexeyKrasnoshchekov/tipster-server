// require express and it's router component
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { getHomeTeamName } = require('../../utils');

const axios = require('axios');
const cheerio = require('cheerio');
const fns = require('date-fns');
const db = require('../../db');

const { BttsDailyTotal  } = require('../../mongo_schema/dailyTotals/BttsDailyTotal');
const { UnderDailyTotal } = require('../../mongo_schema/dailyTotals/UnderDailyTotal');
const { OverDailyTotal  } = require('../../mongo_schema/dailyTotals/OverDailyTotal');
const { WinDailyTotal } = require('../../mongo_schema/dailyTotals/WinDailyTotal');
const { DrawDailyTotal  } = require('../../mongo_schema/dailyTotals/DrawDailyTotal');

const ORIGIN = process.env.ORIGIN;

const prodRouter = express.Router();

prodRouter.use(cors());
const corsOptions = {
  origin: ORIGIN,
};

// Create GET route to read an todo
prodRouter.get('/delete', cors(corsOptions), async (req, res) => {
  // const today = new Date();
  // const formattedToday = fns.format(today, 'dd.MM.yyyy');
  // const todayString = formattedToday.toString();

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  await Draw.deleteMany({ date: req.query.date });
  console.log('Draws deleted'); // Success
  res.send('draws deleted');
  await db.disconnect();
});

//UNDER

prodRouter.get('/getUnderDailyStat', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const UnderProdArr = await UnderDailyTotal.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(UnderProdArr);
});

prodRouter.post('/updateUnderProd', async (req, res) => {
  let data = req.body;
  console.log('dataBttsProd', data);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await BttsProd.deleteMany({});

  if (data.length !== 0) {
    await UnderProd.deleteMany({ date: data[0].date });

    await UnderProd.insertMany(data)
      .then(function () {
        console.log('Under Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  }

  // if (data.length !== 0) {
  //   for (let i = 0; i < data.length; i++) {
  //     const filter = { homeTeam: data[i].homeTeam };
  //     const update = {
  //       resultScore: data[i].resultScore,
  //       underYes: data[i].underYes,
  //     };
  //     UnderProd.updateOne(filter, update, function (err, underProd) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log('under prod updated');
  //       }
  //     });
  //   }
  // }

  await db.disconnect();

  res.send('under prod updated');
});
prodRouter.post('/saveUnderDailyStat', async (req, res) => {
  let data = req.body;
  console.log('dataUnderProd', data);

  if (data.length !== 0) {
    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // console.log('sortedBtts', sortedBtts);
    // await UnderDailyTotal.deleteMany({});
    await UnderDailyTotal.deleteMany({ date: data[0].date });

    await UnderDailyTotal.insertMany(data)
      .then(function () {
        console.log('Under Daily Stat inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('under stat saved');
  }
});

//BTTS

prodRouter.get('/getBttsDailyStat', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const BttsProdArr = await BttsDailyTotal.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(BttsProdArr);
});

prodRouter.post('/updateBttsProd', async (req, res) => {
  let data = req.body;
  console.log('dataBttsProd');

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await BttsProd.deleteMany({});

  if (data.length !== 0) {
    await BttsProd.deleteMany({ date: data[0].date });

    await BttsProd.insertMany(data)
      .then(function () {
        console.log('btts Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  }

  // if (data.length !== 0) {
  //   for (let i = 0; i < data.length; i++) {
  //     const filter = { homeTeam: data[i].homeTeam };
  //     const update = {
  //       resultScore: data[i].resultScore,
  //       bttsRes: data[i].bttsRes,
  //     };
  //     BttsProd.updateOne(filter, update, function (err, underProd) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log('btts prod updated');
  //       }
  //     });
  //   }
  // }

  await db.disconnect();

  res.send('btts prod updated');
});
prodRouter.post('/saveBttsDailyStat', async (req, res) => {
  let data = req.body;
  console.log('dataBttsProd', data);

  if (data.length !== 0) {
    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // console.log('sortedBtts', sortedBtts);
    // await BttsDailyTotal.deleteMany({});
    await BttsDailyTotal.deleteMany({ date: data[0].date });
    await BttsDailyTotal.insertMany(data)
      .then(function () {
        console.log('Btts Daily Stat inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('btts stat saved');
  }
});

//OVER

prodRouter.get('/getOverDailyStat', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const OverProdArr = await OverDailyTotal.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(OverProdArr);
});

prodRouter.post('/updateOverProd', async (req, res) => {
  let data = req.body;
  console.log('dataOverProd');

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await BttsProd.deleteMany({});

  if (data.length !== 0) {
    await OverProd.deleteMany({ date: data[0].date });

    await OverProd.insertMany(data)
      .then(function () {
        console.log('over Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  }

  // if (data.length !== 0) {
  //   for (let i = 0; i < data.length; i++) {
  //     const filter = { homeTeam: data[i].homeTeam };
  //     const update = {
  //       resultScore: data[i].resultScore,
  //       overYes: data[i].overYes,
  //     };
  //     OverProd.updateOne(filter, update, function (err) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log('over prod updated');
  //       }
  //     });
  //   }
  // }

  await db.disconnect();

  res.send('over prod updated');
});
prodRouter.post('/saveOverDailyStat', async (req, res) => {
  let data = req.body;
  console.log('dataOverProd', data);

  if (data.length !== 0) {
    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // console.log('sortedBtts', sortedBtts);
    // await OverDailyTotal.deleteMany({});
    await OverDailyTotal.deleteMany({ date: data[0].date });
    await OverDailyTotal.insertMany(data)
      .then(function () {
        console.log('Over Daily Stat inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('over stat saved');
  }
});

//WIN

prodRouter.get('/getWinDailyStat', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const WinProdArr = await WinDailyTotal.find({ date: req.query.date });
  await db.disconnect();
  console.log('WinProdArr', WinProdArr);
  res.json(WinProdArr);
});

prodRouter.post('/updateWinProd', async (req, res) => {
  let data = req.body;
  console.log('dataWinProd', data);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await BttsProd.deleteMany({});

  if (data.length !== 0) {
    await WinProd.deleteMany({});

    // await WinProd.insertMany(data)
    //   .then(function () {
    //     console.log('win Prod inserted'); // Success
    //   })
    //   .catch(function (error) {
    //     console.log(error); // Failure
    //   });
  }

  // if (data.length !== 0) {
  //   for (let i = 0; i < data.length; i++) {
  //     const filter = { homeTeam: data[i].homeTeam };
  //     const update = {
  //       resultScore: data[i].resultScore,
  //       winRes: data[i].winRes,
  //     };
  //     WinProd.updateOne(filter, update, function (err) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log('win prod updated');
  //       }
  //     });
  //   }
  // }

  await db.disconnect();

  res.send('win prod updated');
});
prodRouter.post('/saveWinDailyStat', async (req, res) => {
  let data = req.body;
  console.log('dataWinProd', data);

  if (data.length !== 0) {
    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // console.log('sortedBtts', sortedBtts);
    // await WinDailyTotal.deleteMany({});
    await WinDailyTotal.deleteMany({ date: data[0].date });
    await WinDailyTotal.insertMany(data)
      .then(function () {
        console.log('Win Daily Stat inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('win stat saved');
  }
});

//DRAW

prodRouter.get('/getDrawDailyStat', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  // await DrawDailyTotal.deleteMany({});

  const DrawProdArr = await DrawDailyTotal.find({ date: req.query.date });
  await db.disconnect();
  console.log('DrawProdArr',DrawProdArr);
  res.json(DrawProdArr);
});

prodRouter.post('/updateDrawProd', async (req, res) => {
  let data = req.body;
  console.log('dataDrawProd');

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await BttsProd.deleteMany({});

  if (data.length !== 0) {
    await DrawProd.deleteMany({ date: data[0].date });

    await DrawProd.insertMany(data)
      .then(function () {
        console.log('draw Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  }

  // if (data.length !== 0) {
  //   for (let i = 0; i < data.length; i++) {
  //     const filter = { homeTeam: data[i].homeTeam };
  //     const update = {
  //       resultScore: data[i].resultScore,
  //       drawYes: data[i].drawYes,
  //     };
  //     DrawProd.updateOne(filter, update, function (err) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log('draw prod updated');
  //       }
  //     });
  //   }
  // }

  await db.disconnect();

  res.send('draw prod updated');
});
prodRouter.post('/saveDrawDailyStat', async (req, res) => {
  let data = req.body;
  console.log('saveDrawDailyStat',data);
  // mongoose.connect(
  //     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
  //     {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     }
  //   );
  // await DrawDailyTotal.deleteMany({});
  // await BttsDailyTotal.deleteMany({});
  // await OverDailyTotal.deleteMany({});
  // await UnderDailyTotal.deleteMany({});
  // await WinDailyTotal.deleteMany({});
  // await db.disconnect();

  if (data.length !== 0) {
    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // console.log('sortedBtts', sortedBtts);
    // await DrawDailyTotal.deleteMany({});
    await DrawDailyTotal.deleteMany({ date: data[0].date });
    await DrawDailyTotal.insertMany(data)
      .then(function () {
        console.log('Draw Daily Stat inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('draw stat saved');
  }
});

// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = prodRouter;
