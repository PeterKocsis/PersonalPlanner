const mongoose = require("mongoose");
const {
  createAvailabilitySettings,
} = require("../utilities/availability-helper");

const settingsSchema = mongoose.Schema({
  settings: {
    type: Object,
    default: {
      frameSettings: {
        availability: createAvailabilitySettings(),
        balances: [],
      },
    },
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
