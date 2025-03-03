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
const { csProd } = require('../../mongo_schema/prod/CsProd');
const { csProdNew } = require('../../mongo_schema/prod/CsProdNew');
const { WinData } = require('../../mongo_schema/WinDataModel');
const { Btts } = require('../../mongo_schema/Btts');
const { Over } = require('../../mongo_schema/Over');
const { BttsProdNew } = require('../../mongo_schema/prod/BttsProdNew');
const { UnderProdNew } = require('../../mongo_schema/prod/UnderProdNew');
const { OverProdNew } = require('../../mongo_schema/prod/OverProdNew');
const { WinProdNew } = require('../../mongo_schema/prod/WinProdNew');

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
  // console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  // const FullTableArr = await FullTable.find({ date: req.query.date });
  const FullTableArr = await FullTable.find();
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

  // await FullTable.deleteMany({});

  // const FullTableZerosArr = await FullTable.find({ isZero: true });
  const FullTableZerosArr = await FullTable.find();
  // let zerosFil = FullTableZerosArr.filter(
  //   (elem) =>
  //     // elem.hasPairsO === 'true' && elem.hasPairsB === 'true' && elem.hasPairsW === 'true'
  //     (elem.hasPairsO === 'false' || elem.hasPairsO === 'false') && elem.hasPairsB === 'true' && elem.hasPairsW === 'true'
  // );


  const zerosFil = FullTableZerosArr.filter(elem => (elem.isZero));
  await db.disconnect();
  // console.log('FullTableZerosArr',FullTableZerosArr.length)
  // console.log('zerosFil',zerosFil.length);
  // console.log('zerosFil2',zerosFil2.length);
  // console.log('FullTable deleted')
  res.json(zerosFil);
});
prodRouter.get('/getFullTableLows', async (req, res) => {
  console.log('req.query.date', req.query.dates);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  // await FullTable.deleteMany({});

  // const FullTableZerosArr = await FullTable.find({ isZero: true });
  const FullTableZerosArr = await FullTable.find();
  // let zerosFil = FullTableZerosArr.filter(
  //   (elem) =>
  //     // elem.hasPairsO === 'true' && elem.hasPairsB === 'true' && elem.hasPairsW === 'true'
  //     (elem.hasPairsO === 'false' || elem.hasPairsO === 'false') && elem.hasPairsB === 'true' && elem.hasPairsW === 'true'
  // );


  const zerosFil = FullTableZerosArr.filter(elem => (elem.resultScore.includes('3 - 2') || elem.resultScore.includes('2 - 3') || elem.resultScore.includes('3 - 3') 
  || elem.resultScore.includes('4 - 1') || elem.resultScore.includes('1 - 4') || elem.resultScore.includes('2 - 4') || elem.resultScore.includes('4 - 2') || elem.resultScore.includes('3 - 4')
  || elem.resultScore.includes('5 - 1') || elem.resultScore.includes('1 - 5') || elem.resultScore.includes('5 - 0') || elem.resultScore.includes('0 - 5')));
  
  
  await db.disconnect();
  // console.log('FullTableZerosArr',FullTableZerosArr.length)
  // console.log('zerosFil',zerosFil.length);
  // console.log('zerosFil2',zerosFil2.length);
  // console.log('FullTable deleted')
  res.json(zerosFil);
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

 

  const UnderProdArr = await UnderProdNew.find();

  // const UnderProdArr = await UnderProdNew.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(UnderProdArr);
});
prodRouter.get('/getUnderProdFront', async (req, res) => {
  console.log('req.query.date', req.query.date);
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

 

  // const UnderProdArr = await UnderProdNew.find();

  const UnderProdArr = await UnderProdNew.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(UnderProdArr);
});

// prodRouter.get('/getUnder45Prods', async (req, res) => {
//   console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   const UnderProdArr = await UnderProd.find({ under45: 'false' });
//   await db.disconnect();
//   console.log('UnderProdArr', UnderProdArr);
//   res.json(UnderProdArr);
// });

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
    await UnderProdNew.deleteMany({ date: data[0].date });

    await UnderProdNew.insertMany(data)
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
    await UnderProdNew.deleteMany({ date: data[0].date });

    await UnderProdNew.insertMany(data)
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

  // await OverProdNew.deleteMany({ date: req.query.date });
  // console.log('OverProdNew Del');

  // const BttsProdArr = await BttsProdNew.find();
  const BttsProdArr = await BttsProd.find({ date: req.query.date });
  await db.disconnect();
  // console.log('UnderProdArr',UnderProdArr)
  res.json(BttsProdArr);
});

// prodRouter.get('/getBttsProdZeros', async (req, res) => {
//   console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   const BttsProdArr = await BttsProd.find({ over05: 'false' });
//   await db.disconnect();
//   console.log('BttsProdArr', BttsProdArr);
//   res.json(BttsProdArr);
// });

// prodRouter.get('/getBttsProdZeros', async (req, res) => {
//   console.log('req.query.date', req.query.dates);
//   // let datesArr = req.query.dates.split(',');
//   // let BttsZerosArr = [];
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );



//   // datesArr.forEach(item => {
//   //   let zeros = BttsProd.find({ date: item, resultScore: '0 - 0' });
//   //   BttsZerosArr.concat(zeros);
//   // })

//   let zeros = BttsProd.find({ resultScore: '0 - 0' });
//   let lud = zeros.filter(elem => elem.homeTeam === 'Ludogorets')
//   // zeros[0].resultScore = '2 - 3';
//   let zeros2 = OverProd.find({ resultScore: '0 - 0' });
//   let lud2 = zeros2.filter(elem => elem.homeTeam === 'Ludogorets')
//   // zeros2[0].resultScore = '2 - 3';

//   console.log('lud111',lud);
//   console.log('lud2',lud2);

//   // await BttsProd.insertMany(zeros)
//   //     .then(function () {
//   //       console.log('btts Prod inserted'); // Success
//   //     })
//   //     .catch(function (error) {
//   //       console.log(error); // Failure
//   //     });
//   // await OverProd.insertMany(zeros2)
//   //     .then(function () {
//   //       console.log('over Prod inserted'); // Success
//   //     })
//   //     .catch(function (error) {
//   //       console.log(error); // Failure
//   //     });

   
//   await db.disconnect();
//   // console.log('UnderProdArr',UnderProdArr)
//   // res.json(BttsZerosArr);
// });

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
    await BttsProdNew.deleteMany({ date: data[0].date });

    await BttsProdNew.insertMany(data)
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

    await BttsProdNew.deleteMany({ date: data[0].date });
    
    // console.log('sortedBtts', sortedBtts);
    await BttsProdNew.insertMany(data)
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


  // OverProdArr = await OverProdNew.find();
  
  // if (req.query.date !== undefined) {
    OverProdArr = await OverProdNew.find({ date: req.query.date });
  // }
  // if (req.query.dates !== undefined) {
  //   let datesArr = req.query.dates.split(',');
  //   let datesArr2 = [];
  //   datesArr.forEach(async (item) => {
  //     datesArr2.push({date: item})
  //   })
  //   console.log('datesArr2', datesArr2);

  //   // let overs = await OverProd.find({ date: '12.11.2023' });
  //   //     console.log('overs', overs);

  //   if (datesArr2.length !==0) {
  //     OverProdNew.find({
  //       $or: datesArr2,
  //     })
  //     .then((ret) => {
  //       console.log('ret', ret);
  //       res.json(ret);
  //     })
  //     .catch((err) => {
  //       // Deal with the error
  //       console.log('err', err);
  //     });

      
  //   }
  // }

  

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

// prodRouter.get('/getOverProdZeros', async (req, res) => {
//   // console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   const OverProdArr = await OverProdNew.find({ over05: 'false' });

//   let betZer = OverProdArr.map(elem => {
//     if (elem.sources.length > 0) {
//       elem.sources = elem.sources.flat();
//     }
//     return elem;
//   })

//   let betZerFil = betZer.filter(elem => elem.sources[0].includes('betimate_o25'));

//   await db.disconnect();
//   // console.log('betZer', betZer);
//   res.json(betZerFil);
// });
// prodRouter.get('/getNotWins', async (req, res) => {
//   console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   const NotWinsArr = await UnderProd.find({ date: '03.04.2024' });
//   const NotWinsArr2 = NotWinsArr.filter(elem => elem.resultScore === ' 0 - 0 ');

//   // const NotWinsArr = await UnderProd.find({
//   //   resultScore: '0 - 0',
//   //   date: '31.10.2023'
//   // });
//   await db.disconnect();
//   console.log('NotWinsArr', NotWinsArr2);
//   res.json(NotWinsArr2);
// });


// prodRouter.get('/getOver05Btts', async (req, res) => {
//   console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   // const over05BttsArr = await BttsProd.find({ over05: 'false' });

//   const NotWinsArr = await BttsProd.find({
//     sources: { $all: ['predictz_btts', 'vitibet_btts'] }
//   });
//   await db.disconnect();
//   console.log('NotWinsArr', NotWinsArr.length);
//   const NotWinsArr2 = NotWinsArr.filter(elem => elem.over05 === 'false')
//   // res.json(over05BttsArr);
//   console.log('NotWinsArr2', NotWinsArr2.length);
// });

// prodRouter.get('/getOver05Win', async (req, res) => {
//   console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   // const over05WinArr = await WinProd.find({ over05: 'false' });

//   const NotWinsArr = await WinProd.find({
//     sources: { $all: ['bettingtips_acc_win', 'footy_win'] }
//   });
//   await db.disconnect();
//   console.log('NotWinsArr111');
//   res.json(NotWinsArr);
// });

// prodRouter.get('/getTestTops', async (req, res) => {
//   console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   // const over05WinArr = await WinProd.find({ over05: 'false' });

//   const winZero = await WinData.find({ homeTeam: 'Dundalk', date: '01.04.2024' });
//   const bttsZero = await Btts.find({ homeTeam: 'Dundalk', date: '01.04.2024' });
//   const overZero = await Over.find({ homeTeam: 'Dundalk', date: '01.04.2024' });

//   const winZero2 = await WinData.find({ homeTeam: 'Spartak Moscow', date: '30.03.2024' });
//   const bttsZero2 = await Btts.find({ homeTeam: 'Spartak Moscow', date: '30.03.2024' });
//   const overZero2 = await Over.find({ homeTeam: 'Spartak Moscow', date: '30.03.2024' });

//   const winZero3 = await WinData.find({ homeTeam: 'Hamilton Academical', date: '30.03.2024' });
//   const bttsZero3 = await Btts.find({ homeTeam: 'Hamilton Academical', date: '30.03.2024' });
//   const overZero3 = await Over.find({ homeTeam: 'Hamilton Academical', date: '30.03.2024' });

//   const winZero4 = await WinData.find({ homeTeam: 'Eintracht Frankfurt', date: '30.03.2024' });
//   const bttsZero4 = await Btts.find({ homeTeam: 'Eintracht Frankfurt', date: '30.03.2024' });
//   const overZero4 = await Over.find({ homeTeam: 'Eintracht Frankfurt', date: '30.03.2024' });

//   const winZero5 = await WinData.find({ homeTeam: 'RB Leipzig', date: '30.03.2024' });
//   const bttsZero5 = await Btts.find({ homeTeam: 'RB Leipzig', date: '30.03.2024' });
//   const overZero5 = await Over.find({ homeTeam: 'RB Leipzig', date: '30.03.2024' });

//   // console.log('winZero',winZero);
//   // console.log('bttsZero',bttsZero);
//   // console.log('overZero',overZero);


//   let zeroSources1 = [];

//   if (winZero.length !==0 && bttsZero.length !==0 && overZero.length !==0) {
//     zeroSources1 = [...winZero.map(elem => elem.source), ...bttsZero.map(elem => elem.source), ...overZero.map(elem => elem.source)];
//   }
  
//   console.log('zeroSources1',zeroSources1.filter((value,index) => zeroSources1.indexOf(value) === index) );

//   let zeroSources2 = [];

//   if (winZero2.length !==0 && bttsZero2.length !==0 && overZero2.length !==0) {
//     zeroSources2 = [...winZero2.map(elem => elem.source), ...bttsZero2.map(elem => elem.source), ...overZero2.map(elem => elem.source)];
//   }
  
//   console.log('zeroSources2',zeroSources2.filter((value,index) => zeroSources2.indexOf(value) === index) );

//   let zeroSources3 = [];

//   if (winZero3.length !==0 && bttsZero3.length !==0 && overZero3.length !==0) {
//     zeroSources3 = [...winZero3.map(elem => elem.source), ...bttsZero3.map(elem => elem.source), ...overZero3.map(elem => elem.source)];
//   }
  
//   console.log('zeroSources3',zeroSources3.filter((value,index) => zeroSources3.indexOf(value) === index) );

//   let zeroSources4 = [];

//   if (winZero4.length !==0 && bttsZero4.length !==0 && overZero4.length !==0) {
//     zeroSources4 = [...winZero4.map(elem => elem.source), ...bttsZero4.map(elem => elem.source), ...overZero4.map(elem => elem.source)];
//   }
  
//   console.log('zeroSources4',zeroSources4.filter((value,index) => zeroSources4.indexOf(value) === index) );

//   let zeroSources5 = [];

//   if (winZero5.length !==0 && bttsZero5.length !==0 && overZero5.length !==0) {
//     zeroSources5 = [...winZero5.map(elem => elem.source), ...bttsZero5.map(elem => elem.source), ...overZero5.map(elem => elem.source)];
//   }
  
//   console.log('zeroSources5',zeroSources5.filter((value,index) => zeroSources5.indexOf(value) === index) );
  
//   // const NotWinsArr = await WinProd.find({
//   //   sources: { $all: ['fbp_win', 'fbp365_win'] }
//   //   // sources: { $all: ['prot_win', 'footy_win'] }
//   //   // sources: 'footsuper_win'
//   // });

//   // const WinProdArr = await WinProd.find({ date: req.query.date });
//   // const NotWinsArr3 = await WinProd.find({
//   //   // sources: { $all: ['soccertipz_win', 'wininbets_win'] }
//   //   sources: { $all: ['soccertipz_win', 'predutd_win'] }
//   // });
//   // console.log('NotWinsArr', NotWinsArr);
  
//   // console.log('NotWinsArr3', NotWinsArr3.length);
//   // const NotWinsArr2 = NotWinsArr.filter(elem => elem.resultScore.includes('1 - 0'));
//   // const NotWinsArr2 = NotWinsArr.filter(elem => elem.over05 === 'false');
//   await db.disconnect();
//   // console.log('NotWinsArr2', NotWinsArr2.length);
//   // console.log('NotWinsArr4', NotWinsArr4.length);
//   // res.json(NotWinsArr);
// });





// prodRouter.get('/getNotUnder45', async (req, res) => {
//   // console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   // const NotWinsArr = await WinProd.find({ winRes: 'false' });

//   const NotUnderArr = await UnderProd.find({ under45: 'false' });
//   // await db.disconnect();
//   // console.log('NotUnder45Arr', NotWinsArr);

//   // const OverProdArr = await UnderProd.find({
//   //   sources: { $all: ['fbp2_u25', 'betimate_u25'] }
//   // });
//   await db.disconnect();
//   // console.log('OverProdArr', OverProdArr);

//   res.json(NotUnderArr);
// });
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
    await OverProdNew.deleteMany({ date: data[0].date });

    await OverProdNew.insertMany(data)
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
    await OverProdNew.deleteMany({ date: data[0].date });
    
    await OverProdNew.insertMany(data)
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

  const WinProdArr = await WinProdNew.find({ date: req.query.date });
  await db.disconnect();
  console.log('WinProdArr', WinProdArr);
  res.json(WinProdArr);
});

// prodRouter.get('/getWinProdZeros', async (req, res) => {
//   console.log('req.query.date', req.query.date);
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   const WinProdArr = await WinProd.find({ over05: 'false' });
//   await db.disconnect();
//   console.log('WinProdArr', WinProdArr);
//   res.json(WinProdArr);
// });

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
    await WinProdNew.deleteMany({ date: data[0].date });

    await WinProdNew.insertMany(data)
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

    await WinProdNew.deleteMany({ date: data[0].date });

    await WinProdNew.insertMany(data)
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
prodRouter.post('/saveCsProd', async (req, res) => {
  let data = req.body;
  console.log('dataCsProd', data);

  if (data.length !== 0) {
    mongoose.connect(
      'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    await csProdNew.deleteMany({ date: data[0].date });

    // console.log('sortedBtts', sortedBtts);
    await csProdNew.insertMany(data)
      .then(function () {
        console.log('Cs Prod inserted'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    await db.disconnect();
    res.send('cs prod saved');
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
