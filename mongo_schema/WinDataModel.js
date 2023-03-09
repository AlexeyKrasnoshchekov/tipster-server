const mongoose = require('mongoose');
const { Schema } = mongoose;

const WinDataSchema = new Schema(
  {
    source: { type: String, required: true },
    action: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: false },
    date: { type: String, required: true },
    prediction: { type: String, required: true },
    predictionDate: { type: String, required: false }
  },
  {
    timestamps: true,
  }
);

const WinData =
  mongoose.models?.WinData || mongoose.model('WinData', WinDataSchema);

// export default Headline;
module.exports = { WinData };
