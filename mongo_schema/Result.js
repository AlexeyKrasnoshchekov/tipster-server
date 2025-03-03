const mongoose = require('mongoose');
const { Schema } = mongoose;

// Btts model
const Result = mongoose.model(
  'Result',
  new mongoose.Schema(
    {
      score: { type: String, required: false },
      homeTeam: { type: String, required: false },
      awayTeam: { type: String, required: false },
      date: { type: String, required: false },
    },
    {
      timestamps: true,
    }
  )
);

// export default Headline;
module.exports = { Result };
