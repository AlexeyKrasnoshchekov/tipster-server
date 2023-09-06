const mongoose = require('mongoose');
const { Schema } = mongoose;

const ZeroCounterSchema = new Schema(
  {
    o25tip_win: {
      total: Number,
      matches: [String],
    },
    bettingtips_o25: {
      total: Number,
      matches: [String],
    },
    wincomparator_o25: {
      total: Number,
      matches: [String],
    },
    accum_btts: {
      total: Number,
      matches: [String],
    },
    fst_btts: {
      total: Number,
      matches: [String],
    },
    r2bet_o25: {
      total: Number,
      matches: [String],
    },
    hello_o25: {
      total: Number,
      matches: [String],
    },
    fbp_o25: {
      total: Number,
      matches: [String],
    },
    fst_o25: {
      total: Number,
      matches: [String],
    },
    footsuper_o25: {
      total: Number,
      matches: [String],
    },
    footsuper_btts: {
      total: Number,
      matches: [String],
    },
    bettingtips_btts: {
      total: Number,
      matches: [String],
    },
    prot_o25: {
      total: Number,
      matches: [String],
    },
    r2bet_btts: {
      total: Number,
      matches: [String],
    },
    goalnow_o25: {
      total: Number,
      matches: [String],
    },
    accum_o25: {
      total: Number,
      matches: [String],
    },
    wincomparator_btts: {
      total: Number,
      matches: [String],
    },
    wincomparator_win: {
      total: Number,
      matches: [String],
    },
    mybets_win: {
      total: Number,
      matches: [String],
    },
    venasbet_win: {
      total: Number,
      matches: [String],
    },
    prot_win: {
      total: Number,
      matches: [String],
    },
    footy_win: {
      total: Number,
      matches: [String],
    },
    betgenuine_win: {
      total: Number,
      matches: [String],
    },
    vitibet_win: {
      total: Number,
      matches: [String],
    },
    r2bet_win: {
      total: Number,
      matches: [String],
    },
    mines_win: {
      total: Number,
      matches: [String],
    },
    passion_win: {
      total: Number,
      matches: [String],
    },
    fbp_win: {
      total: Number,
      matches: [String],
    },
    footsuper_win: {
      total: Number,
      matches: [String],
    },
    hello_win: {
      total: Number,
      matches: [String],
    },
    bettingtips_win: {
      total: Number,
      matches: [String],
    },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ZeroCounter =
  mongoose.models?.ZeroCounter ||
  mongoose.model('ZeroCounter', ZeroCounterSchema);

// export default Headline;
module.exports = { ZeroCounter };
