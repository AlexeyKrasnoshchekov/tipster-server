const mongoose = require('mongoose');
const { Schema } = mongoose;

const winDailyTotalSchema = new Schema(
  {
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    date: { type: String, required: true },
    winYesCount: { type: Number, required: true },
    over05Count: { type: Number, required: true },
    over15Count: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const WinDailyTotal =
  mongoose.models?.WinDailyTotal || mongoose.model('WinDailyTotal', winDailyTotalSchema);

// export default Headline;
module.exports = { WinDailyTotal };
