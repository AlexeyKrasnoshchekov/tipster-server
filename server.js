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
const testRouter = require('./routes/test');
const drawRouter = require('./routes/draw');
const prodRouter = require('./routes/prod');

const mongoose = require('mongoose');

// const { Over } = require('./mongo_schema/Over');

mongoose.set('strictQuery', true);

app.use(bodyParser.json());

app.use(cors());

// route middlewares
app.use('/btts', bttsRouter);
app.use('/over', overRouter);
app.use('/draw', drawRouter);
app.use('/crawl', crawlRouter);
app.use('/win', winRouter);
app.use('/result', resultRouter);
app.use('/total', totalRouter);
app.use('/under', underRouter);
app.use('/test', testRouter);
app.use('/prod', prodRouter);

///////APIS

app.get('/', function (req, res) {
  res.json('This is my webscraper');
});

// app.get('/formatClubs', async (req, res) => {
//   mongoose.connect(
//     'mongodb+srv://admin:aQDYgPK9EwiuRuOV@cluster0.2vcd6.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   );

//   const bttsArr = await Btts.find({ date: req.query.date });
//   await db.disconnect();

//   res.json(bttsArr);
// });

app.listen(PORT || 5000, () => console.log(`server running on PORT ${PORT}`));

// Export the Express API
module.exports = app;
