const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('uuid');

const underStatTotalSchema = new Schema(
  {
    _id: {type: String, default: uuid.v4},
    action: { type: String, required: true },
    source: { type: String, required: false },
    totalPreds: { type: Number, required: true },
    date: { type: String, required: true },
    under25Count: { type: Number, required: true },
    under25Eff: { type: Number, required: false },
    under35Count: { type: Number, required: true },
    under35Eff: { type: Number, required: false },
    under45Count: { type: Number, required: true },
    under45Eff: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const UnderStatTotal =
  mongoose.models?.UnderStatTotal || mongoose.model('UnderStatTotal', underStatTotalSchema);

// export default Headline;
module.exports = { UnderStatTotal };
