const mongoose = require('mongoose');
const { Schema } = mongoose;

// Btts model
const ResultTotal = mongoose.model(
  'ResultTotal',
  new mongoose.Schema(
    {
      score: { type: String, required: true },
      homeTeam: { type: String, required: true },
      awayTeam: { type: String, required: false },
      source: { type: String, required: true },
      prediction: { type: String, required: true },
      date: { type: String, required: true },
      bttsRes: { type: Boolean, required: true },
      over05Res: { type: Boolean, required: true },
      over15Res: { type: Boolean, required: true },
      over25Res: { type: Boolean, required: true },
    },
    {
      timestamps: true,
    }
  )
);

// export default Headline;
module.exports = { ResultTotal };
