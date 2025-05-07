const mongoose = require('mongoose');

const spaceSchema = mongoose.Schema({
    displayName: { type: String, required: true },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const model = mongoose.model('Space', spaceSchema);

module.exports = model;