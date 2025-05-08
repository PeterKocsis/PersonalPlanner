const mongoose = require('mongoose');

const spaceSchema = mongoose.Schema({
    displayName: { type: String, required: true },
    readOnly: { type: Boolean, default: false },
    excludedFromPrioList: { type: Boolean, default: false },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const model = mongoose.model('Space', spaceSchema);

module.exports = model;