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
    date: { type: String, required: true },
    totalSources: { type: Number, required: false },
    totalItems: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const BttsProd =
  mongoose.models?.BttsProd || mongoose.model('BttsProd', bttsProdSchema);

// export default Headline;
module.exports = { BttsProd };
