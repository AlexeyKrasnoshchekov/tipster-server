const mongoose = require('mongoose');
const { Schema } = mongoose;

const winProdNewSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    prediction: { type: String, required: true },
    count: { type: Number, required: true },
    sources: { type: String, required: false },
    // pairsArr: [[{ type: String, required: false }]],
    // pairsArrOW: [[{ type: String, required: false }]],
    // zeroPairsArr: [[{ type: String, required: false }]],
    // csHighScore: [{ type: String, required: false }],
    numAcca: { type: Number, required: true },
    resultScore: { type: String, required: false },
    winNum: { type: Number, required: false },
    xwinNum: { type: Number, required: false },
    winRes: { type: String, required: false },
    xwinRes: { type: String, required: false },
    over05: { type: String, required: false },
    // hasPairs: { type: String, required: false },
    // zeroPairs: { type: String, required: false },
    // hasPairsOW: { type: String, required: false },
    date: { type: String, required: true },
    totalSources: { type: Number, required: false },
    totalItems: { type: Number, required: false },
    // highWinYesEff: { type: Number, required: false },
    // everageWinYesEffW: { type: Number, required: false },
    // lowWinYesEff: { type: Number, required: false },
    // highOver05Eff: { type: Number, required: false },
    // everageOver05EffW: { type: Number, required: false },
    // lowOver05Eff: { type: Number, required: false },
    // highOver15Eff: { type: Number, required: false },
    // everageOver15EffW: { type: Number, required: false },
    // lowOver15Eff: { type: Number, required: false },
    // under25Count: { type: Number, required: false },
    // countTopO05W: { type: Number, required: false },
    // countTopO15W: { type: Number, required: false },
    // countTopXwin: { type: Number, required: false },
    // isTop: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const WinProdNew =
  mongoose.models?.WinProdNew || mongoose.model('WinProdNew', winProdNewSchema);

// export default Headline;
module.exports = { WinProdNew };
