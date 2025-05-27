const mongoose = require('mongoose');

const timeFrameSchema = mongoose.Schema({
    index : { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('TimeFrame', timeFrameSchema);