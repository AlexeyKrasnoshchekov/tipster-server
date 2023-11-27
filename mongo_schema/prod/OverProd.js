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
    over05: { type: String, required: false },
    date: { type: String, required: true },
    totalSources: { type: Number, required: false },
    totalItems: { type: Number, required: false },
    highOver05Eff: { type: Number, required: false },
    everageOver05EffO: { type: Number, required: false },
    lowOver05Eff: { type: Number, required: false },
    highOver15Eff: { type: Number, required: false },
    everageOver15EffO: { type: Number, required: false },
    lowOver15Eff: { type: Number, required: false },
    highOver25Eff: { type: Number, required: false },
    everageOver25EffO: { type: Number, required: false },
    lowOver25Eff: { type: Number, required: false },
    countTopO05O: { type: Number, required: false },
    countTopO15O: { type: Number, required: false },
    countTopO25O: { type: Number, required: false },
    under25Count: { type: Number, required: false },
    isTop: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const OverProd =
  mongoose.models?.OverProd || mongoose.model('OverProd', overProdSchema);

// export default Headline;
module.exports = { OverProd };
