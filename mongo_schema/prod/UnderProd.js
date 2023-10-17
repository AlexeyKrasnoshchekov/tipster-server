const mongoose = require('mongoose');
const { Schema } = mongoose;

const underProdSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    count: { type: Number, required: true },
    numAcca: { type: Number, required: true },
    action: { type: String, required: true },
    resultScore: { type: String, required: false },
    sources: [{ type: String, required: false }],
    underYes: { type: String, required: false },
    date: { type: String, required: true },
    totalSources: { type: Number, required: false },
    totalItems: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const UnderProd =
  mongoose.models?.UnderProd || mongoose.model('UnderProd', underProdSchema);

// export default Headline;
module.exports = { UnderProd };
