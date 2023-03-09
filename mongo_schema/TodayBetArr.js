const mongoose = require('mongoose');
const { Schema } = mongoose;

const todayBetArrSchema = new Schema(
  {
    source: { type: String, required: false },
    action: { type: String, required: false },
    homeTeam: { type: String, required: false },
    awayTeam: { type: String, required: false },
    date: { type: String, required: false },
    predictionDate: { type: String, required: false },
    createdAt: { type: String, required: false },
    updatedAt: { type: String, required: false },
    checked: { type: Boolean, required: false },
    __v: { type: Number, required: false },
    _id: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const TodayBetArr =
  mongoose.models?.TodayBetArr || mongoose.model('TodayBetArr', todayBetArrSchema);

// export default Headline;
module.exports = { TodayBetArr };
