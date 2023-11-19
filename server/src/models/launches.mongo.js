const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    require: true,
  },
  launchDate: {
    type: Number,
    require: true,
  },
  mission: {
    type: Number,
    require: true,
  },
  rocket: {
    type: Number,
    require: true,
  },
  target: {
    ttype: String,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    require: true,
  },
  success: {
    type: Boolean,
    require: true,
    default: true,
  },
});

module.exports = mongoose.model("Lauch", launchesSchema);
