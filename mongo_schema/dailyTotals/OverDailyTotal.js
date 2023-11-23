const mongoose = require('mongoose');
const { Schema } = mongoose;

const overDailyTotalSchema = new Schema(
  {
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    date: { type: String, required: true },
    over05Count: { type: Number, required: true },
    over15Count: { type: Number, required: true },
    over25Count: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const OverDailyTotal =
  mongoose.models?.OverDailyTotal || mongoose.model('OverDailyTotal', overDailyTotalSchema);

// export default Headline;
module.exports = { OverDailyTotal };
