const mongoose = require('mongoose');
const { Schema } = mongoose;

const correctScoreSchema = new Schema(
  {
    source: { type: String, required: true },
    score: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    date: { type: String, required: true },
    homeTeamWin: { type: String, required: false },
    draw: { type: String, required: false },
    awayTeamWin: { type: String, required: false },
    under25pred: { type: String, required: false },
    over25pred: { type: String, required: false },
    bttsYespred: { type: String, required: false },
    bttsNopred: { type: String, required: false },
    total: { type: Number, required: false },
    // resultScore: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const correctScore =
  mongoose.models?.correctScore || mongoose.model('correctScore', correctScoreSchema);

// export default Headline;
module.exports = { correctScore };
