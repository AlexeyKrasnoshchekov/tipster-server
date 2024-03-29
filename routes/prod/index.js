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
const { Draw } = require('../../mongo_schema/Draw');
const { BttsProd } = require('../../mongo_schema/prod/BttsProd');
const { UnderProd } = require('../../mongo_schema/prod/UnderProd');
const { OverProd } = require('../../mongo_schema/prod/OverProd');
const { WinProd } = require('../../mongo_schema/prod/WinProd');
const { DrawProd } = require('../../mongo_schema/prod/DrawProd');
const { FullTable } = require('../../mongo_schema/prod/FullTable');

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

//FullTable

prodRouter.get('/getFullTable', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const FullTableArr = await FullTable.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(FullTableArr);
});
prodRouter.get('/getFullTableZeros', async (req, res) => {
  console.log('req.query.date', req.query.dates);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const FullTableZerosArr = await FullTable.find({ isZero: true });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(FullTableZerosArr);
});


prodRouter.post('/updateFullTable', async (req, res) => {
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
    await FullTable.deleteMany({ date: data[0].date });

    await FullTable.insertMany(data)
      .then(function () {
        console.log('FullTable inserted'); // Success
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

  res.send('FullTable updated');
});
prodRouter.post('/saveFullTable', async (req, res) => {
  let data = req.body;
  console.log('dataFullTable', data);

  // mongoose.connect(
  //   'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
  //   {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   }
  // );

  // await FullTable.deleteMany({ });

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
    await FullTable.insertMany(data)
      .then(function () {
        console.log('FullTable inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('full table saved');
  }
});
//UNDER

prodRouter.get('/getUnderProd', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const UnderProdArr = await UnderProd.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(UnderProdArr);
});

prodRouter.get('/getUnder45Prods', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const UnderProdArr = await UnderProd.find({ under45: 'false' });
  await db.disconnect();
  console.log('UnderProdArr', UnderProdArr);
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
prodRouter.post('/saveUnderProd', async (req, res) => {
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
    await UnderProd.insertMany(data)
      .then(function () {
        console.log('Under Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('under prod saved');
  }
});

//BTTS

prodRouter.get('/getBttsProd', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const BttsProdArr = await BttsProd.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(BttsProdArr);
});

prodRouter.get('/getBttsProdZeros', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const BttsProdArr = await BttsProd.find({ over05: 'false' });
  await db.disconnect();
  console.log('BttsProdArr', BttsProdArr);
  res.json(BttsProdArr);
});

prodRouter.get('/getBttsProdZeros', async (req, res) => {
  console.log('req.query.date', req.query.dates);
  let datesArr = req.query.dates.split(',');
  let BttsZerosArr = [];
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );



  datesArr.forEach(item => {
    let zeros = BttsProd.find({ date: item, resultScore: '0 - 0' });
    BttsZerosArr.concat(zeros);
  })

   
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(BttsZerosArr);
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
prodRouter.post('/saveBttsProd', async (req, res) => {
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
    await BttsProd.insertMany(data)
      .then(function () {
        console.log('Btts Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('btts prod saved');
  }
});

//OVER

prodRouter.get('/getOverProd', async (req, res) => {
  console.log('req.query.date', req.query.date);
  console.log('req.query.dates111', req.query.dates);
  let OverProdArr = [];
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );
  
  if (req.query.date !== undefined) {
    OverProdArr = await OverProd.find({ date: req.query.date });
  }
  if (req.query.dates !== undefined) {
    let datesArr = req.query.dates.split(',');
    let datesArr2 = [];
    datesArr.forEach(async (item) => {
      datesArr2.push({date: item})
    })
    console.log('datesArr2', datesArr2);

    // let overs = await OverProd.find({ date: '12.11.2023' });
    //     console.log('overs', overs);

    if (datesArr2.length !==0) {
      OverProd.find({
        $or: datesArr2,
      })
      .then((ret) => {
        console.log('ret', ret);
        res.json(ret);
      })
      .catch((err) => {
        // Deal with the error
        console.log('err', err);
      });

      
    }
  }

  

  // let OverProdArr = await OverProd.find({ date: req.query.date });
  // if (req.query.date !== undefined) {
  //   OverProdArr = await OverProd.find({ date: req.query.date });
  // } else {
  //   // OverProdArr = await OverProd.find({});
  //   OverProdArr = await OverProd.find({});
  // }
  await db.disconnect();
  // console.log('OverProdArr',OverProdArr)
  res.json(OverProdArr);
});

prodRouter.get('/getOverProdZeros', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const OverProdArr = await OverProd.find({ over05: 'false' });
  await db.disconnect();
  console.log('OverProdArr', OverProdArr);
  res.json(OverProdArr);
});
// prodRouter.get('/getAllOverProd', async () => {
//   // console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   const OverProdArr = await OverProd.find({});
//   await db.disconnect();
//   // console.log('UnderProdArr',UnderProdArr)
//   res.json(OverProdArr);
// });

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
prodRouter.post('/saveOverProd', async (req, res) => {
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
    await OverProd.insertMany(data)
      .then(function () {
        console.log('Over Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('over prod saved');
  }
});

//WIN

prodRouter.get('/getWinProd', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const WinProdArr = await WinProd.find({ date: req.query.date });
  await db.disconnect();
  console.log('WinProdArr', WinProdArr);
  res.json(WinProdArr);
});

prodRouter.get('/getWinProdZeros', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const WinProdArr = await WinProd.find({ over05: 'false' });
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
    await WinProd.deleteMany({ date: data[0].date });

    await WinProd.insertMany(data)
      .then(function () {
        console.log('win Prod inserted'); // Success
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

  res.send('win prod updated');
});
prodRouter.post('/saveWinProd', async (req, res) => {
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
    await WinProd.insertMany(data)
      .then(function () {
        console.log('Win Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('win prod saved');
  }
});

//DRAW

prodRouter.get('/getDrawProd', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const DrawProdArr = await DrawProd.find({ date: req.query.date });
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
prodRouter.post('/saveDrawProd', async (req, res) => {
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
    await DrawProd.insertMany(data)
      .then(function () {
        console.log('Draw Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('draw prod saved');
  }
});

// Create DELETE route to remove an todo
// router.delete('/todo/:id', removeTodo);

module.exports = prodRouter;
