const mongoose = require('mongoose');
const { Schema } = mongoose;

const fullTableSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    allCount: { type: Number, required: true },
    allEv15: { type: Number, required: true },
    date: { type: String, required: true },
    overCount: { type: Number, required: false },
    overAccaCount: { type: Number, required: false },
    everageOver15EffO: { type: Number, required: false },
    countTopO15O: { type: Number, required: false },
    bttsCount: { type: Number, required: false },
    bttsAccaCount: { type: Number, required: false },
    bttsYesNum: { type: Number, required: false },
    bttsNoNum: { type: Number, required: false },
    everageOver15EffB: { type: Number, required: false },
    countTopO15B: { type: Number, required: false },
    underCount: { type: Number, required: false },
    underAccaCount: { type: Number, required: false },
    winCount: { type: Number, required: false },
    winAccaCount: { type: Number, required: false },
    everageOver15EffW: { type: Number, required: false },
    countTopO15W: { type: Number, required: false },
    resultScore: { type: String, required: false },
    isZero: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

const FullTable =
  mongoose.models?.FullTable || mongoose.model('FullTable', fullTableSchema);

// export default Headline;
module.exports = { FullTable };
