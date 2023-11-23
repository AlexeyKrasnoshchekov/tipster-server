const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('uuid');

const winStatTotalSchema = new Schema(
  {
    _id: {type: String, default: uuid.v4},
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    date: { type: String, required: true },
    winYesCount: { type: Number, required: true },
    winYesEff: { type: Number, required: false },
    over05Count: { type: Number, required: true },
    over05Eff: { type: Number, required: false },
    over15Count: { type: Number, required: true },
    over15Eff: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const WinStatTotal =
  mongoose.models?.WinStatTotal || mongoose.model('WinStatTotal', winStatTotalSchema);

// export default Headline;
module.exports = { WinStatTotal };
