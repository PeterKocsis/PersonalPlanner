const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const checkAuth = require('../middleware/check-auth');

router.get('', checkAuth, (req, res, next) => {
    Task.find()
        .then(tasks => {
            res.status(200).json({
                message: 'Tasks fetched successfully!',
                tasks: tasks
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            res.status(500).json({
                message: 'Error fetching tasks'
            });
        });
})

router.post('', checkAuth, (req, res, next) => {
    const task = req.body;
    // if (!task.title || !task.description || !task.spaceId || task.timeToCompleteMinutes === undefined) {
    //     return res.status(400).json({
    //         message: 'Missing required fields: title, description, spaceId, or timeToCompleteMinutes'
    //     });
    // }
    // if (typeof task.completed !== 'boolean') {
    //     return res.status(400).json({
    //         message: 'Invalid value for completed field, it should be a boolean'
    //     });
    // }
    // if (task.timeToCompleteMinutes < 0) {
    //     return res.status(400).json({
    //         message: 'timeToCompleteMinutes cannot be negative'
    //     });
    // }
    // if (task.frameTasksToScheduleId && typeof task.frameTasksToScheduleId !== 'string') {
    //     return res.status(400).json({
    //         message: 'frameTasksToScheduleId must be a string if provided'
    //     });
    // }
    // if (task.scheduledDayId && typeof task.scheduledDayId !== 'string') {
    //     return res.status(400).json({
    //         message: 'scheduledDayId must be a string if provided'
    //     });
    // }

    console.log('Received task:', task);
    const newTask = new Task({
        title: task.title,
        description: task.description,
        spaceId: task.spaceId,
        timeToCompleteMinutes: task.timeToCompleteMinutes,
        completed: task.completed,
        ownerId: req.userData.userId,
        frameTasksToScheduleId: task.frameTasksToScheduleId || null,
        scheduledDayId: task.scheduledDayId || undefined});

    
    newTask.save()
        .then(() => {
            res.status(201).json({
                message: 'Task created successfully!',
                task: newTask
            });
        })
        .catch(error => {
            console.error('Error creating task:', error);
            res.status(500).json({
                message: 'Error creating task'
            });
        });
}
);
router.delete('/:id', checkAuth, (req, res, next) => {
    Task.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: 'Task deleted successfully!'
            });
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            res.status(500).json({
                message: 'Error deleting task'
            });
        });
}
);

router.put('/:id', checkAuth, async (req, res, next)=> {
    const task = req.body;
    console.log(`Request to update task to`);
    console.log(task);
    try {
        const updatedTask = await Task
            .findOne({_id: req.params.id})
            .updateOne({ spaceId: task.spaceId, title: task.title, description: task.description, timeToCompleteMinutes: task.timeToCompleteMinutes, completed: task.completed, frameTasksToScheduleId: task.frameTasksToScheduleId || null });
        console.log(`Task updated ${updatedTask}`);
        console.log(updatedTask)
        res.status(200).json(
            updatedTask
        );
    } catch (error) {
        console.log('Error during task update', error);
            res.status(500).json({
                message: 'Error during task update'
            })
    }
});

router.put('/:id/space', checkAuth, async (req, res, next)=> {
    console.log(req);
    const spaceId = req.body.spaceId;
    console.log(`Update task with this: ${spaceId}`);
    try {
        const updatedTask = await Task.findOne({_id: req.params.id}).updateOne({ spaceId: spaceId});
        console.log('Task updated');
        res.status(200).json(
            updatedTask
        );
    } catch (error) {
        console.log('Error during task update', error);
            res.status(500).json({
                message: 'Error during task update'
            })
    }
});

router.put('/:id/state', checkAuth, async (req, res, next)=> {
    console.log(req);
    const newTaskState = req.body.state;
    console.log(`Update task with this: ${newTaskState}`);
    try {
        await Task.findOne({_id: req.params.id}).updateOne({ completed: newTaskState});
        console.log('Task updated');
        const updatedTask = await Task.findOne({_id: req.params.id});
        res.status(200).json(
            updatedTask
        );
    } catch (error) {
        console.log('Error during completion state change', error);
            res.status(500).json({
                message: 'Error during completion state change'
            })
    }
});

module.exports = router;