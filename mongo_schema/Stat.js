const mongoose = require('mongoose');
const { Schema } = mongoose;

// Btts model
const Stat = mongoose.model(
  'Stat',
  new mongoose.Schema(
    {
      total: { type: Number, required: true },
      date: { type: String, required: false },
      fbp: {
        total: { type: Number, required: true },
        bttsMisArr: [
          {
            score: { type: String, required: true },
            homeTeam: { type: String, required: true },
            awayTeam: { type: String, required: false },
            source: { type: String, required: true },
            prediction: { type: String, required: true },
            date: { type: String, required: false },
            bttsRes: { type: Boolean, required: true },
            over05Res: { type: Boolean, required: true },
            over15Res: { type: Boolean, required: true },
            over25Res: { type: Boolean, required: true },
          },
        ],
        over05MisArr: [
          {
            score: { type: String, required: true },
            homeTeam: { type: String, required: true },
            awayTeam: { type: String, required: false },
            source: { type: String, required: true },
            prediction: { type: String, required: true },
            date: { type: String, required: false },
            bttsRes: { type: Boolean, required: true },
            over05Res: { type: Boolean, required: true },
            over15Res: { type: Boolean, required: true },
            over25Res: { type: Boolean, required: true },
          },
        ],
        bttsMisPerc: { type: Number, required: false },
        over05MisPerc: { type: Number, required: false },
      },
    },
    {
      timestamps: true,
    }
  )
);

// export default Headline;
module.exports = { Stat };
