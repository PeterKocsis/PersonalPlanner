const mongoose = require('mongoose');

const frameTasksToSchedule = mongoose.Schema({
    date: { type: Date, required: true },
    taskIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('FrameTasksToSchedule', frameTasksToSchedule);