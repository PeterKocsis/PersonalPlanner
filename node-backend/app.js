const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const Space = require('./models/space');
const SpacePriority = require('./models/spacePriority');
const config = require('./configuration-values');
const Task = require('./models/task');

mongoose.connect(config.connectionString)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(() => {
        console.log('Connection FAILED to MongoDB');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/api/tasks', (req, res, next) => {
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

app.post('/api/tasks', (req, res, next) => {
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
app.delete('/api/tasks/:id', (req, res, next) => {
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

app.post('/api/spaces', (req, res, next) => {
    const space = req.body;
    console.log('Received displayName:', space);
    const newSpace = new Space({
        displayName: space.displayName
    });
    SpacePriority.find().then((spacePriority) => {
        console.log('Space priority:', spacePriority);
        if (spacePriority.length === 0) {
            const newSpacePriority = new SpacePriority({
                spaceList: []
            });
            newSpacePriority.spaceList.push(newSpace._id);
            newSpacePriority.save()
                .then(() => {
                    console.log('Space priority created successfully!');
                })
                .catch(error => {
                    console.error('Error creating space priority:', error);
                });
        } else {
            spacePriority[0].spaceList.push(newSpace._id);
            spacePriority[0].save()
                .then(() => {
                    newSpace.save()
                        .then((space) => {
                            res.status(201).json({
                                message: `Space created successfully with id: ${space._id}!`,
                                newSpace: space
                            });
                        })
                        .catch(error => {
                            console.error('Error creating space:', error);
                        });
                    console.log('Space priority updated successfully!');
                })
                .catch(error => {
                    console.error('Error updating space priority:', error);
                });
            
        }
    });
});

app.delete('/api/spaces/:id', (req, res, next) => {
    Space.deleteOne({ _id: req.params.id })
        .then(() => {
            SpacePriority.find()
                .then((spacePriority) => {
                    const index = spacePriority[0].spaceList.indexOf(req.params.id);
                    if (index > -1) {
                        spacePriority[0].spaceList.splice(index, 1);
                    }
                    spacePriority[0].save()
                        .then(() => {
                            console.log('Space priority updated successfully!');
                        })
                        .catch(error => {
                            console.error('Error updating space priority:', error);
                        });
                })
                .catch(error => {
                    console.error('Error finding space priority:', error);
                });
            res.status(200).json({
                message: 'Space deleted successfully!'
            });
        })
        .catch(error => {
            console.error('Error deleting space:', error);
            res.status(500).json({
                message: 'Error deleting space'
            });
        });
});

app.put('/api/spacePriority', (req, res, next) => {
    const spacePrioList = req.body;
    console.log('Received space priority:', spacePrioList);
    SpacePriority.find()
        .then((spacePriorityDoc) => {
            if (spacePriorityDoc.length > 0) {
                spacePriorityDoc[0].spaceList = spacePrioList;
                spacePriorityDoc[0].save()
                    .then(() => {
                        res.status(200).json({
                            message: 'Space priority updated successfully!'
                        });
                    })
                    .catch(error => {
                        console.error('Error updating space priority:', error);
                        res.status(500).json({
                            message: 'Error updating space priority'
                        });
                    });
            } else {
                res.status(404).json({
                    message: 'Space priority not found'
                });
            }
        })
        .catch(error => {
            console.error('Error finding space priority:', error);
            res.status(500).json({
                message: 'Error finding space priority'
            });
        });
    
})


app.get('/api/spaces', (req, res, next) => {
    Space.find()
        .then(spaces => {
            SpacePriority.find()
            .then((spacePriority) => {
                const sortedSpaces = [];
                spacePriority[0].spaceList.forEach((spaceId) => {
                    const space = spaces.find(space => space._id.toString() === spaceId.toString());
                    if (space) {
                        sortedSpaces.push(space);
                    }
                });
                console.log('Sorted spaces:', sortedSpaces);
                res.status(200).json({
                    message: 'Spaces fetched successfully!',
                    spaces: sortedSpaces
                });
            })
        })
        .catch(error => {
            console.error('Error fetching spaces:', error);
            res.status(500).json({
                message: 'Error fetching spaces'
            });
        });
});

module.exports = app;