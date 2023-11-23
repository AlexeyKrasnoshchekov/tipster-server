const mongoose = require('mongoose');
const { Schema } = mongoose;

const drawDailyTotalSchema = new Schema(
  {
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    drawYesCount: { type: Number, required: true },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const DrawDailyTotal =
  mongoose.models?.DrawDailyTotal || mongoose.model('DrawDailyTotal', drawDailyTotalSchema);

// export default Headline;
module.exports = { DrawDailyTotal };
