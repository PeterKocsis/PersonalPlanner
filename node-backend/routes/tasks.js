const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const checkAuth = require("../middleware/check-auth");
const {
  addTaskToPocket,
  removeTaskFromPocket,
  collectFrameListData,
  collectFrameData,
} = require("../utilities/time-frame-helper");
const { default: mongoose } = require("mongoose");

router.get("", checkAuth, (req, res, next) => {
  Task.find()
    .then((tasks) => {
      res.status(200).json({
        message: "Tasks fetched successfully!",
        tasks: tasks,
      });
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      res.status(500).json({
        message: "Error fetching tasks",
      });
    });
});

router.post("", checkAuth, async (req, res, next) => {
  const task = req.body;
  console.log("Received task:", task);

  //Make a new mongoose sesssion
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const newTask = new Task({
      title: task.title,
      description: task.description,
      spaceId: task.spaceId,
      timeToCompleteMinutes: task.timeToCompleteMinutes,
      completed: task.completed,
      ownerId: req.userData.userId,
      assignedTimeRange: task.assignedTimeRange,
      scheduledDayId: task.scheduledDayId || undefined,
    });
    //Check if task is in pocket
    if (newTask.assignedTimeRange) {
      console.log("Task is in pocket, adding to pocket");
      await addTaskToPocket(newTask, session, req.userData.userId);
    }
    const savedTask = await newTask.save({ session });
    console.log("Task saved:", savedTask);
    const modifiedFrame = await collectFrameData(task.assignedTimeRange, req.userData.userId);
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      message: "Task created successfully!",
      task: savedTask,
      modifiedFrame: modifiedFrame,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Error creating task",
    });
  }
});

router.delete("/:id", checkAuth, async (req, res, next) => {
  const session = await mongoose.startSession();
  const taskId = req.params.id;
  session.startTransaction();
  console.log("Deleting task with ID:", taskId);
  try {
    const task = await Task.findOne({ _id: taskId, ownerId: req.userData.userId });
    await removeTaskFromPocket(taskId, task.assignedTimeRange, session, req.userData.userId);
    await Task.deleteOne({ _id: taskId, ownerId: req.userData.userId }).session(
      session
    );
    await session.commitTransaction();
    session.endSession();
    console.log("Task deleted successfully");
    res.status(200).json({
      message: "Task deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      message: "Error deleting task",
    });
  }
});

router.put("/:id", checkAuth, async (req, res, next) => {
  const task = req.body;
  console.log(`Request to update task to`, task);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const storedTask = await Task.findOne({
      _id: req.params.id,
      ownerId: req.userData.userId,
    });
    // PocketRangeId has been assigned to the task
    if (!storedTask.assignedTimeRange && task.assignedTimeRange) {
      await addTaskToPocket(task, session, req.userData.userId);
    }
    // PocketRangeId has been removed from the task
    if (storedTask.assignedTimeRange && !task.assignedTimeRange) {
      await removeTaskFromPocket(req.params.id, session, req.userData.userId);
    }
    // PocketRangeId has changed from one to another
    if (
      storedTask.assignedTimeRange &&
      task.assignedTimeRange &&
      storedTask.assignedTimeRange !== task.assignedTimeRange
    ) {
      await removeTaskFromPocket(req.params.id, session, req.userData.userId);
      await addTaskToPocket(task, session, req.userData.userId);
    }
    // Update the task with the new values
    await storedTask
      .set({
        spaceId: task.spaceId,
        title: task.title,
        description: task.description,
        timeToCompleteMinutes: task.timeToCompleteMinutes,
        completed: task.completed,
        assignedTimeRange: task.assignedTimeRange || null,
        scheduledDayId: task.scheduledDayId || undefined,
      })
      .save({ session });
    await session.commitTransaction();
    await session.endSession();
    console.log("Task updated successfully");
    res.status(200).json(storedTask);
  } catch (error) {
    console.log("Error during task update", error);
    res.status(500).json({
      message: "Error during task update",
    });
  }
});

router.put("/:id/space", checkAuth, async (req, res, next) => {
  console.log(req);
  const spaceId = req.body.spaceId;
  console.log(`Update task with this: ${spaceId}`);
  try {
    const updatedTask = await Task.findOne({ _id: req.params.id }).updateOne({
      spaceId: spaceId,
    });
    console.log("Task updated");
    res.status(200).json(updatedTask);
  } catch (error) {
    console.log("Error during task update", error);
    res.status(500).json({
      message: "Error during task update",
    });
  }
});

router.put("/:id/state", checkAuth, async (req, res, next) => {
  console.log(req);
  const newTaskState = req.body.state;
  console.log(`Update task with this: ${newTaskState}`);
  try {
    await Task.findOne({ _id: req.params.id }).updateOne({
      completed: newTaskState,
    });
    console.log("Task updated");
    const updatedTask = await Task.findOne({ _id: req.params.id });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.log("Error during completion state change", error);
    res.status(500).json({
      message: "Error during completion state change",
    });
  }
});

module.exports = router;
