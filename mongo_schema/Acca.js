const mongoose = require('mongoose');
const { Schema } = mongoose;

const accaSchema = new Schema(
  {
    source: { type: String, required: true },
    action: { type: String, required: true },
    homeTeam: { type: String, required: false },
    prediction: { type: String, required: true },
    awayTeam: { type: String, required: false },
    date: { type: String, required: true },
    predictionDate: { type: String, required: false },
    checked: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

const Acca =
  mongoose.models?.Acca || mongoose.model('Acca', accaSchema);

// export default Headline;
module.exports = { Acca };
