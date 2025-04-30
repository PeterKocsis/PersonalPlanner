const mongoose = require('mongoose');

const spacePriority = mongoose.Schema({
    spaceList: { type: Array, default: [] },
});

module.exports = mongoose.model('SpacePriority', spacePriority);