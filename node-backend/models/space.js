const mongoose = require('mongoose');

const spaceSchema = mongoose.Schema({
    displayName: { type: String, required: true },
    vision: { type: String, default: '' },
    color: { type: String , default: '#000000'},
    icon: { type: String, default: '' },
});

module.exports = mongoose.model('Space', spaceSchema);