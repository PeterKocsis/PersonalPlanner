const mongoose = require('mongoose');
const frameTasksToSchedule = require('./frameTasksToSchedule');

const taskShema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    spaceId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    timeToCompleteMinutes: { type: Number, default: 0 },
    scheduledTime: { type: Date, default: undefined },
    frameTasksToScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'FrameTasksToSchedule', default: null },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Task', taskShema);