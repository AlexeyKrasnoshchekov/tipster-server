const mongoose = require('mongoose');
const { Schema } = mongoose;

const todayBetSchema = new Schema(
  {
    date: { type: String, required: true },
    coef: { type: Number, required: true },
    bets: [
      {
        homeTeam: { type: String, required: true },
        footyStat: {
          homeTeam: { type: String, required: false },
          goalsAVG: { type: String, required: false },
          bttsProb: { type: String, required: false },
          over25Prob: { type: String, required: false },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TodayBet =
  mongoose.models?.TodayBet || mongoose.model('TodayBet', todayBetSchema);

// export default Headline;
module.exports = { TodayBet };
