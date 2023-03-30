const mongoose = require('mongoose');
const { Schema } = mongoose;

const under25Schema = new Schema(
  {
    source: { type: String, required: true },
    action: { type: String, required: true },
    homeTeam: { type: String, required: true },
    prediction: { type: String, required: false },
    awayTeam: { type: String, required: false },
    date: { type: String, required: true },
    predictionDate: { type: String, required: false },
    checked: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

const Under25 =
  mongoose.models?.Under25 || mongoose.model('Under25', under25Schema);

// export default Headline;
module.exports = { Under25 };
