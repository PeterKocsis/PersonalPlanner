const mongoose = require('mongoose');

const taskShema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    spaceId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    timeToCompleteMinutes: { type: Number, default: 0 },
    scheduledDayId: { type: mongoose.Schema.Types.ObjectId, ref: 'DaySchedule', default: null },
    assignedTimeRange: { type: Object, default: undefined },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Task', taskShema);