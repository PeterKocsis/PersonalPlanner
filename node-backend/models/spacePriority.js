const mongoose = require('mongoose');

const spacePriority = mongoose.Schema({
    spaceList: { type: Array, default: [] },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('SpacePriority', spacePriority);