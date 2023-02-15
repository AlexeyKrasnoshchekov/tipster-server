const mongoose = require('mongoose');
const { Schema } = mongoose;

const todayBetSchema = new Schema(
  {
    date: { type: String, required: true },
    coef: { type: Number, required: true },
    bets: [
      {
        source: { type: String, required: true },
        action: { type: String, required: true },
        homeTeam: { type: String, required: true },
        awayTeam: { type: String, required: false },
        date: { type: String, required: true },
        predictionDate: { type: String, required: false },
        checked: { type: Boolean, required: false },
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
