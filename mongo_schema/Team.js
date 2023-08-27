const mongoose = require('mongoose');
const { Schema } = mongoose;

// Btts model
const Team = mongoose.model(
  'Team',
  new mongoose.Schema(
    {
      name: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);

// export default Headline;
module.exports = { Team };
