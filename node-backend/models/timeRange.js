const mongoose = require('mongoose');

const timeRangeSchema = mongoose.Schema({
    year: { type: Number, required: true },
    index : { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('TimeRange', timeRangeSchema);