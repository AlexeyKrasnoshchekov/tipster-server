const mongoose = require('mongoose');
const { Schema } = mongoose;

const subSchema = new mongoose.Schema({
  source: { type: String, required: true },
  score: { type: String, required: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: false },
  date: { type: String, required: true },
  homeTeamWin: { type: String, required: false },
  draw: { type: String, required: false },
  awayTeamWin: { type: String, required: false },
  total: { type: Number, required: false },
});

const csProdNewSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    // source: { type: String, required: true },
    // score: { type: String, required: true },
    date: { type: String, required: true },
    evGoals: { type: Number, required: false },
    sourcesNum: { type: Number, required: false },
    totalGoals: { type: Number, required: false },
    totalHomeWin: { type: Number, required: false },
    totalDraw: { type: Number, required: false },
    totalAwayWin: { type: Number, required: false },
    totalOver25: { type: Number, required: false },
    totalUnder25: { type: Number, required: false },
    totalBttsNo: { type: Number, required: false },
    totalBttsYes: { type: Number, required: false },
    resultScore: { type: String, required: false },
    vitibet: { type: subSchema, required: false },
    fbpai: { type: subSchema, required: false },
    footsuper: { type: subSchema, required: false },
    soccertipz: { type: subSchema, required: false },
    betimate: { type: subSchema, required: false },
    fbp: { type: subSchema, required: false },
    betwizad: { type: subSchema, required: false },
    bettingclosed: { type: subSchema, required: false },
  },
  {
    timestamps: true,
  }
);

const csProdNew =
  mongoose.models?.csProdNew || mongoose.model('csProdNew', csProdNewSchema);

// export default Headline;
module.exports = { csProdNew };
