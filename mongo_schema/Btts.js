const mongoose = require('mongoose');
const { Schema } = mongoose;

const bttsSchema = new Schema(
  {
    source: { type: String, required: true },
    action: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    date: { type: String, required: true },
    predictionDate: { type: String, required: false },
    checked: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

const Btts =
  mongoose.models?.Btts || mongoose.model('Btts', bttsSchema);

// export default Headline;
module.exports = { Btts };
