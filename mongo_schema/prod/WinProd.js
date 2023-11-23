const mongoose = require('mongoose');
const { Schema } = mongoose;

const winProdSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    prediction: { type: String, required: true },
    count: { type: Number, required: true },
    sources: [{ type: String, required: false }],
    numAcca: { type: Number, required: true },
    resultScore: { type: String, required: false },
    winNum: { type: Number, required: false },
    xwinNum: { type: Number, required: false },
    winRes: { type: String, required: false },
    over05: { type: String, required: false },
    date: { type: String, required: true },
    totalSources: { type: Number, required: false },
    totalItems: { type: Number, required: false },
    highWinYesEff: { type: Number, required: false },
    everageWinYesEffW: { type: Number, required: false },
    lowWinYesEff: { type: Number, required: false },
    highOver05Eff: { type: Number, required: false },
    everageOver05EffW: { type: Number, required: false },
    lowOver05Eff: { type: Number, required: false },
    highOver15Eff: { type: Number, required: false },
    everageOver15EffW: { type: Number, required: false },
    lowOver15Eff: { type: Number, required: false },
    under25Count: { type: Number, required: false },
    countTopO05W: { type: Number, required: false },
    countTopO15W: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const WinProd =
  mongoose.models?.WinProd || mongoose.model('WinProd', winProdSchema);

// export default Headline;
module.exports = { WinProd };
