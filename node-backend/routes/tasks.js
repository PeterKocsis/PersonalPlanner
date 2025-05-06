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
    console.log('Received task:', task);
    const newTask = new Task({
        title: task.title,
        description: task.description,
        spaceId: task.spaceId
    });
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

module.exports = router;