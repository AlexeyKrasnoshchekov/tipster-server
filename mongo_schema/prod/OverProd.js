const mongoose = require('mongoose');
const { Schema } = mongoose;

const overProdSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    count: { type: Number, required: true },
    numAcca: { type: Number, required: true },
    action: { type: String, required: true },
    resultScore: { type: String, required: false },
    sources: [{ type: String, required: false }],
    overYes: { type: String, required: false },
    date: { type: String, required: true },
    totalSources: { type: Number, required: false },
    totalItems: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const OverProd =
  mongoose.models?.OverProd || mongoose.model('OverProd', overProdSchema);

// export default Headline;
module.exports = { OverProd };
