const mongoose = require('mongoose');

const taskShema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    spaceId: { type: String, required: true },
});

module.exports = mongoose.model('Task', taskShema);