const mongoose = require('mongoose');

//TODO Use date instead of fixed year and index, 
//TODO this way multiple element could be part of a time frame in case of time frame length change
const schedulePocketSchema = mongoose.Schema({
    year: { type: Number, required: true },
    index: { type: Number, required: true },
    taskIds: { type: Array, default: [] },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('SchedulePocketModel', schedulePocketSchema);