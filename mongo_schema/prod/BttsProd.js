const mongoose = require('mongoose');
const { Schema } = mongoose;

const bttsProdSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    count: { type: Number, required: true },
    numAcca: { type: Number, required: true },
    bttsYesNum: { type: Number, required: false },
    bttsNoNum: { type: Number, required: false },
    resultScore: { type: String, required: false },
    sources: [{ type: String, required: false }],
    bttsRes: { type: String, required: false },
    highBttsYesEff: { type: Number, required: false },
    everageBttsYesEffB: { type: Number, required: false },
    lowBttsYesEff: { type: Number, required: false },
    over05: { type: String, required: false },
    highOver05YesEff: { type: Number, required: false },
    everageOver05YesEffB: { type: Number, required: false },
    lowOver05Eff: { type: Number, required: false },
    highOver15YesEff: { type: Number, required: false },
    everageOver15YesEffB: { type: Number, required: false },
    lowOver15Eff: { type: Number, required: false },
    date: { type: String, required: true },
    totalSources: { type: Number, required: false },
    totalItems: { type: Number, required: false },
    under25Count: { type: Number, required: false },
    countTopO05B: { type: Number, required: false },
    countTopO15B: { type: Number, required: false },
    countTopBtts: { type: Number, required: false },
    isTop: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

const BttsProd =
  mongoose.models?.BttsProd || mongoose.model('BttsProd', bttsProdSchema);

// export default Headline;
module.exports = { BttsProd };
