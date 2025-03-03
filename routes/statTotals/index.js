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

const { BttsStatTotal  } = require('../../mongo_schema/statTotals/BttsStatTotal');
const { UnderStatTotal } = require('../../mongo_schema/statTotals/UnderStatTotal');
const { OverStatTotal  } = require('../../mongo_schema/statTotals/OverStatTotal');
const { WinStatTotal } = require('../../mongo_schema/statTotals/WinStatTotal');
const { DrawStatTotal  } = require('../../mongo_schema/statTotals/DrawStatTotal');

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

prodRouter.get('/getUnderStatTotal', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  // await UnderStatTotal.deleteMany({});

  const UnderProdArr = await UnderStatTotal.find({ date: req.query.date });
  
  await db.disconnect();
  console.log('UnderProdArr',UnderProdArr)
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
        console.log('Under Stat Total updated'); // Success
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
prodRouter.post('/saveUnderStatTotal', async (req, res) => {
  let data = req.body;
  console.log('dataUnderProd', data);

  // mongoose.connect(
  //   'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
  //   {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   }
  // );

    // await UnderStatTotal.deleteMany({});
    // await OverStatTotal.deleteMany({});
    // await BttsStatTotal.deleteMany({});
    // await WinStatTotal.deleteMany({});
    // await DrawStatTotal.deleteMany({});

    

  if (data.length !== 0) {
    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // console.log('sortedBtts', sortedBtts);

    // await UnderStatTotal.deleteMany({ date: data[0].date });
    await UnderStatTotal.insertMany(data)
      .then(function () {
        console.log('Under Stat Total inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('under stat saved');
  }

  // await db.disconnect();
  // console.log('22333')
  // res.send('under stat saved');
});

//BTTS

prodRouter.get('/getBttsStatTotal', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  

  const BttsProdArr = await BttsStatTotal.find({ date: req.query.date });

  // BttsProdArr.forEach(elem => {
  //   elem.over05Count = 0;
  //   elem.over05Eff = 0;
  //   elem.over15Count = 0;
  //   elem.over15Eff = 0;
  //   elem.bttsYesCount = 0;
  //   elem.bttsYesEff = 0;
  //   elem.totalPreds = 0;
  //   elem.totalPredsYes = 0;
  // })

  // await BttsStatTotal.deleteMany({date: req.query.date});

  // await BttsStatTotal.insertMany(BttsProdArr)
  //     .then(function () {
  //       console.log('Btts Stat Total inserted'); // Success
  //     })
  //     .catch(function (error) {
  //       console.log(error); // Failure
  //     });
  

  // BttsProdArr.forEach(elem => {
  //   elem.date = "06.11.2023";
  // });

  // console.log('BttsProdArr',BttsProdArr);

  // await BttsStatTotal.deleteMany({});

  // await BttsStatTotal.insertMany(BttsProdArr)
  //     .then(function () {
  //       console.log('Btts Stat Total inserted'); // Success
  //     })
  //     .catch(function (error) {
  //       console.log(error); // Failure
  //     });
  await db.disconnect();
  console.log('BttsProdArr',BttsProdArr)
  res.json(BttsProdArr);
});

prodRouter.post('/updateBttsStatTotal', async (req, res) => {
  let data = req.body;
  // console.log('dataBttsProd');

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await BttsProd.deleteMany({});

  if (data.length !== 0) {
    await DrawStatTotal.deleteMany({ date: data[0].date });

    await DrawStatTotal.insertMany(data)
      .then(function () {
        console.log('btts Stat Total updated'); // Success
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
prodRouter.post('/saveBttsStatTotal', async (req, res) => {
  let data = req.body;
  // console.log('dataBttsProd', data);

  // mongoose.connect(
  //   'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
  //   {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   }
  // );

  // await BttsStatTotal.deleteMany({ });

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
    await BttsStatTotal.deleteMany({ date: data[0].date });
    await BttsStatTotal.insertMany(data)
      .then(function () {
        console.log('Btts Stat Total inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('btts stat saved');
  }
});

//OVER

prodRouter.get('/getOverStatTotal', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const OverProdArr = await OverStatTotal.find({ date: req.query.date });
  console.log('OverProdArr',OverProdArr)
  // let OverProdArr1 = OverProdArr.filter(elem => elem._id !== '740d57f4-a4fa-4ac6-8849-c9dafd8a9aad')
  res.json(OverProdArr);
  await db.disconnect();

  

  // OverProdArr.push({
  //   action: 'over25',
  //   source: 'betstat_o05',
  //   totalPreds: 0,
  //   date: '09.01.2024',
  //   over05Count: 0,
  //   over05Eff: 0,
  //   over15Count: 0,
  //   over15Eff: 0,
  //   over25Count: 0,
  //   over25Eff: 0
  // },{
  //   action: 'over25',
  //   source: 'overl_o05',
  //   totalPreds: 0,
  //   date: '09.01.2024',
  //   over05Count: 0,
  //   over05Eff: 0,
  //   over15Count: 0,
  //   over15Eff: 0,
  //   over25Count: 0,
  //   over25Eff: 0
  // })
  

  // if (OverProdArr.length !== 0) {
  //   await OverStatTotal.deleteMany({ date: OverProdArr[0].date });

  //   await OverStatTotal.insertMany(OverProdArr1)
  //     .then(function () {
  //       console.log('over Stat Total updated'); // Success
  //     })
  //     .catch(function (error) {
  //       console.log(error); // Failure
  //     });
  // }
  
 
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
    await OverStatTotal.deleteMany({ date: data[0].date });

    await OverStatTotal.insertMany(data)
      .then(function () {
        console.log('over Stat Total updated'); // Success
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
prodRouter.post('/saveOverStatTotal', async (req, res) => {
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
    await OverStatTotal.deleteMany({ date: data[0].date });
    await OverStatTotal.insertMany(data)
      .then(function () {
        console.log('Over Stat Total inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('over stat saved');
  }
});

//WIN

prodRouter.get('/getWinStatTotal', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const WinProdArr = await WinStatTotal.find({ date: req.query.date });
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
    await WinStatTotal.deleteMany({ date: data[0].date });

    await WinStatTotal.insertMany(data)
      .then(function () {
        console.log('win Stat Total updated'); // Success
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

  res.send('win Stat Total updated');
});
prodRouter.post('/saveWinStatTotal', async (req, res) => {
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
    await WinStatTotal.deleteMany({ date: data[0].date });
    await WinStatTotal.insertMany(data)
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

prodRouter.get('/getDrawStatTotal', async (req, res) => {
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

  const DrawProdArr = await DrawStatTotal.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
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
    await DrawStatTotal.deleteMany({ date: data[0].date });

    await DrawStatTotal.insertMany(data)
      .then(function () {
        console.log('draw Stat Total updated'); // Success
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
prodRouter.post('/saveDrawStatTotal', async (req, res) => {
  let data = req.body;
  console.log('dataDrawProd', data);

  if (data.length !== 0) {
    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // console.log('sortedBtts', sortedBtts);
    await DrawStatTotal.deleteMany({ date: data[0].date });
    await DrawStatTotal.insertMany(data)
      .then(function () {
        console.log('Draw Stat Total inserted'); // Success
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
