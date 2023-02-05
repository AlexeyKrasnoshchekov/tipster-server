const mongoose = require('mongoose');
const { Schema } = mongoose;

// Btts model
const Result = mongoose.model(
  'Result',
  new mongoose.Schema(
    {
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
module.exports = { Result };
