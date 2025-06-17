const Task = require('../models/task');
const SchedulePocketModel = require('../models/schedulePocket');

const collectFrameData = async(timeRanges, userId)=> {
    return await Promise.all(
        timeRanges.map(async range => {
        const pockets = await SchedulePocketModel.find({
                ownerId: userId,
                year: range.startDate.getFullYear(),
                index: range.index
            });
            console.log('Pockets for time range:', pockets);
        if (pockets && pockets.length === 0) {
            return {
                ...range,
                pocketsTasks: []
            };;
        } else {
            let pocketTasks = [];
            for (const pocket of pockets) {
                pocketTasks =  await Task.find({
                        _id: { $in: pocket.taskIds },
                        ownerId: userId
                    }
                );
            }
            return {
                ...range,
                pocketsTasks: pocketTasks
            };
        }
    }));
}

const addTaskToPocket = async (task, session, userId) => {
    const pocket = await SchedulePocketModel.findOne({
        ownerId: userId,
        year: timeRange.year,
        index: timeRange.index
    });
    //No pocket found create a new one 
    if (!pocket) {
        const newPocket = new SchedulePocketModel({
            ownerId: userId,
            year: timeRange.year,
            index: timeRange.index,
            taskIds: [taskId]
        });
        await newPocket.save();
    } else {
        // Pocket found, add the task to the existing pocket
        pocket.taskIds.push(taskId);
        await pocket.save();
    }
}

module.exports = { collectFrameData, addTaskToPocket };