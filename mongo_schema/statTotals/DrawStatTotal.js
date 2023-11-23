const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('uuid');

const drawStatTotalSchema = new Schema(
  {
    _id: {type: String, default: uuid.v4},
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    drawYesCount: { type: Number, required: true },
    drawYesEff: { type: Number, required: false },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const DrawStatTotal =
  mongoose.models?.DrawStatTotal || mongoose.model('DrawStatTotal', drawStatTotalSchema);

// export default Headline;
module.exports = { DrawStatTotal };
