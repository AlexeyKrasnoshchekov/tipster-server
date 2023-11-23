const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('uuid');

const overStatTotalSchema = new Schema(
  {
    _id: {type: String, default: uuid.v4},
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    date: { type: String, required: true },
    over05Count: { type: Number, required: true },
    over05Eff: { type: Number, required: false },
    over15Count: { type: Number, required: true },
    over15Eff: { type: Number, required: false },
    over25Count: { type: Number, required: true },
    over25Eff: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const OverStatTotal =
  mongoose.models?.OverStatTotal || mongoose.model('OverStatTotal', overStatTotalSchema);

// export default Headline;
module.exports = { OverStatTotal };
