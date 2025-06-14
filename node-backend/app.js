const express = require('express');
const bodyParser = require('body-parser');

const spacesRoutes = require('./routes/spaces');
const tasksRoutes = require('./routes/tasks');
const spacePriorityRoutes = require('./routes/space-priority');
const userRoutes = require('./routes/user');
const timeFramesRoutes = require('./routes/time-frame');
const timeRangesRoutes = require('./routes/time-ranges');

const app = express();
const mongoose = require('mongoose');
const config = require('./configuration-values');

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
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/spaces', spacesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/spacePriority', spacePriorityRoutes);
app.use('/api/user', userRoutes);
app.use('/api/timeFrames', timeFramesRoutes);
app.use('/api/time-range', timeRangesRoutes);


module.exports = app;