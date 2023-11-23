const mongoose = require('mongoose');
const { Schema } = mongoose;

const underDailyTotalSchema = new Schema(
  {
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    date: { type: String, required: true },
    under25Count: { type: Number, required: true },
    under35Count: { type: Number, required: true },
    under45Count: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const UnderDailyTotal =
  mongoose.models?.UnderDailyTotal || mongoose.model('UnderDailyTotal', underDailyTotalSchema);

// export default Headline;
module.exports = { UnderDailyTotal };
