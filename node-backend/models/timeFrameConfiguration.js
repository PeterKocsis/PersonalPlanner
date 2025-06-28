const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    availablity
});

const model = mongoose.model('Settings', settingsSchema);

module.exports = model;