const mongoose = require('mongoose');
const { Schema } = mongoose;

const bttsOtherSchema = new Schema(
  {
    source: { type: String, required: true },
    action: { type: String, required: true },
    homeTeam: { type: String, required: true },
    prediction: { type: String, required: false },
    awayTeam: { type: String, required: false },
    date: { type: String, required: true },
    predictionDate: { type: String, required: false },
    checked: { type: Boolean, required: false },
    isAcca: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

const BttsOther =
  mongoose.models?.BttsOther || mongoose.model('Btts', bttsOtherSchema);

// export default Headline;
module.exports = { BttsOther };
