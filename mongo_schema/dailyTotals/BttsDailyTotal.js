const mongoose = require('mongoose');
const { Schema } = mongoose;

const bttsDailyTotalSchema = new Schema(
  {
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    totalPredsYes: { type: Number, required: true },
    totalPredsNo: { type: Number, required: true },
    date: { type: String, required: true },
    bttsYesCount: { type: Number, required: true },
    bttsNoCount: { type: Number, required: true },
    over05Count: { type: Number, required: true },
    over15Count: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const BttsDailyTotal =
  mongoose.models?.BttsDailyTotal || mongoose.model('BttsDailyTotal', bttsDailyTotalSchema);

// export default Headline;
module.exports = { BttsDailyTotal };
