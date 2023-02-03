const mongoose = require('mongoose');
const { Schema } = mongoose;

// Btts model
const Btts = mongoose.model(
  'Btts',
  new mongoose.Schema(
    {
      source: { type: String, required: true },
      action: { type: String, required: true },
      homeTeam: { type: String, required: true },
      awayTeam: { type: String, required: false },
      resultDescription: { type: String, required: false },
      btts: { type: Boolean, required: false },
      over25: { type: Boolean, required: false },
    },
    {
      timestamps: true,
    }
  )
);

// export default Headline;
module.exports = { Btts };
