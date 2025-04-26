const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const Space = require('./models/space');
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
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/spaces', (req, res, next) => {
    const space = req.body;
    const newSpace = new Space({
        displayName: space.displayName,
        vision: space.vision,
        color: space.color,
        icon: space.icon
    });
    newSpace.save()
        .then((result) => {
            res.status(201).json({
                message: `Space created successfully with id: ${result._id}!`,
                spaceId: result._id
            });
        })
        .catch(error => {
            console.error('Error creating space:', error);
        });
});

app.delete('/api/spaces/:id', (req, res, next) => {
    Space.deleteOne({ _id: req.params.id })
        .then(() => {
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


app.get('/api/spaces', (req, res, next) => {
    Space.find()
        .then(spaces => {
            res.status(200).json({
                message: 'Spaces fetched successfully!',
                spaces: spaces
            });
        })
        .catch(error => {
            console.error('Error fetching spaces:', error);
            res.status(500).json({
                message: 'Error fetching spaces'
            });
        });
});

module.exports = app;