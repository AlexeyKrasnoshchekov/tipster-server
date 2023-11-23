const mongoose = require('mongoose');
const { Schema } = mongoose;

const drawProdSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    count: { type: Number, required: true },
    numAcca: { type: Number, required: true },
    action: { type: String, required: true },
    resultScore: { type: String, required: false },
    sources: [{ type: String, required: false }],
    drawYes: { type: String, required: false },
    date: { type: String, required: true },
    totalSources: { type: Number, required: false },
    totalItems: { type: Number, required: false },
    highDrawYesEff: { type: Number, required: false },
    everageDrawYesEffD: { type: Number, required: false },
    lowDrawYesEff: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const DrawProd =
  mongoose.models?.DrawProd || mongoose.model('DrawProd', drawProdSchema);

// export default Headline;
module.exports = { DrawProd };
