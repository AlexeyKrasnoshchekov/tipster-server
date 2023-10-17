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
    for (let i = 0; i < data.length; i++) {
      const filter = { homeTeam: data[i].homeTeam };
      const update = {
        resultScore: data[i].resultScore,
        underYes: data[i].underYes,
      };
      UnderProd.updateOne(filter, update, function (err, underProd) {
        if (err) {
          console.log(err);
        } else {
          console.log('under prod updated');
        }
      });
    }
  }

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
    for (let i = 0; i < data.length; i++) {
      const filter = { homeTeam: data[i].homeTeam };
      const update = {
        resultScore: data[i].resultScore,
        bttsRes: data[i].bttsRes,
      };
      BttsProd.updateOne(filter, update, function (err, underProd) {
        if (err) {
          console.log(err);
        } else {
          console.log('btts prod updated');
        }
      });
    }
  }

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
  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  const OverProdArr = await OverProd.find({ date: req.query.date });
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
    for (let i = 0; i < data.length; i++) {
      const filter = { homeTeam: data[i].homeTeam };
      const update = {
        resultScore: data[i].resultScore,
        overYes: data[i].overYes,
      };
      OverProd.updateOne(filter, update, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('over prod updated');
        }
      });
    }
  }

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
  console.log('WinProdArr',WinProdArr)
  res.json(WinProdArr);
});

prodRouter.post('/updateWinProd', async (req, res) => {
  let data = req.body;
  console.log('dataWinProd',data);

  mongoose.connect(
    'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // await BttsProd.deleteMany({});

  if (data.length !== 0) {
    for (let i = 0; i < data.length; i++) {
      const filter = { homeTeam: data[i].homeTeam };
      const update = {
        resultScore: data[i].resultScore,
        winRes: data[i].winRes,
      };
      WinProd.updateOne(filter, update, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('win prod updated');
        }
      });
    }
  }

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
    for (let i = 0; i < data.length; i++) {
      const filter = { homeTeam: data[i].homeTeam };
      const update = {
        resultScore: data[i].resultScore,
        drawYes: data[i].drawYes,
      };
      DrawProd.updateOne(filter, update, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('draw prod updated');
        }
      });
    }
  }

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
