const Task = require("../models/task");
const SchedulePocketModel = require("../models/schedulePocket");

const collectFrameData = async (timeRange, userId, session) => {
  if (!timeRange) return null;
  const pockets = await SchedulePocketModel.find({
    ownerId: userId,
    year: timeRange.year,
    index: timeRange.index,
  }).session(session);
  console.log("Pockets for time range:", pockets);
  if (pockets && pockets.length === 0) {
    return {
      ...timeRange,
      pocketsTasks: [],
    };
  } else {
    let pocketTasks = [];
    for (const pocket of pockets) {
      pocketTasks = await Task.find({
        _id: { $in: pocket.taskIds },
        ownerId: userId,
      }).session(session);
    }
    return {
      ...timeRange,
      pocketsTasks: pocketTasks,
    };
  }
};

const collectFrameListData = async (timeRanges, userId) => {
  return await Promise.all(
    timeRanges.map(async (range) => {
      return await collectFrameData(range, userId);
    })
  );
};

const addTaskToPocket = async (task, session, userId) => {
  const { year, index } = { ...task.assignedTimeRange };
  let pocket = null;
  pocket = await SchedulePocketModel.findOne({
    ownerId: userId,
    year: year,
    index: index,
  }).session(session);
  //No pocket found create a new one
  if (!pocket) {
    const newPocket = new SchedulePocketModel({
      ownerId: userId,
      year: year,
      index: index,
      taskIds: [task._id],
    });
    await newPocket.save({ session });
  } else {
    // Add task if it is not already in the pocket
    if (pocket.taskIds.includes(task._id)) {
      console.log("Task already exists in the pocket");
      return;
    }
    // Pocket found, add the task to the existing pocket
    pocket.taskIds.push(task._id);
    await pocket.save({ session });
    return await collectFrameData(task.assignedTimeRange, userId, session);
  }
};

const removeTaskFromPocket = async (taskId, timeRange, session, userId) => {
  const { year, index } = { ...timeRange };
  const pocket = await SchedulePocketModel.findOne({
    ownerId: userId,
    year: year,
    index: index,
  }).session(session);
  let modifiedFrame = undefined;
  if (pocket) {
    const taskIndex = pocket.taskIds.indexOf(taskId);
    if (taskIndex > -1) {
      pocket.taskIds.splice(taskIndex, 1);
      await pocket.save({ session });
    }
    // If the pocket is empty, you might want to delete it
    if (pocket.taskIds.length === 0) {
      await SchedulePocketModel.deleteOne({ _id: pocket._id }).session(session);
    }
    modifiedFrame = await collectFrameData(timeRange, userId, session);
    console.log("Modified frame after removing task:", modifiedFrame);
  }
  console.log(`Task ${taskId} removed from pocket`);
  return modifiedFrame;
};

module.exports = {
  collectFrameData,
  collectFrameListData,
  addTaskToPocket,
  removeTaskFromPocket,
};
