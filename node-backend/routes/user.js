const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SpacePriority = require('../models/spacePriority');
const mongoose = require('mongoose');
const Space = require('../models/space')
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const defaultSecret = require('../utilities/auth-utils')

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per windowMs
    message: 'Too many login attempts, please try again later'
});

const generateToken = (user) => {
    return jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET || defaultSecret,
        { expiresIn: '1h' }
    );
};


router.post('/signup', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const hash = await bcrypt.hash(req.body.password, 10);

        const user = new User({ email: req.body.email, password: hash });
        const savedUser = await user.save({ session });

        const inboxSpace = new Space({displayName: 'Inbox', ownerID: savedUser._id, readOnly: true, excludedFromPrioList: true });
        const othersSpace = new Space({ displayName: 'Others', ownerID: savedUser._id, readOnly: true});

        const spacePrio = new SpacePriority({ spaceList: [], ownerID: savedUser._id });
        spacePrio.spaceList.push(othersSpace._id);
        
        await inboxSpace.save({session});
        await othersSpace.save({session});
        await spacePrio.save({ session });

        // Add the inbox and others spaces to the user data
        savedUser.inboxSpaceId = inboxSpace._id;
        savedUser.othersSpaceId = othersSpace._id;
        savedUser.spacePriorityId = spacePrio._id;
        await savedUser.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: 'User created successfully!',
            result: { email: savedUser.email, id: savedUser._id }
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.log(`Failed to create user: ${err}`);
        res.status(500).json({
            message: err?.message,
        })
    }
});

router.post('/login', loginLimiter, async (req, res, next) => {
    try {
        const fetchedUser = await User.findOne({ email: req.body.email });
        if (!fetchedUser) {
            return res.status(401).json({ message: 'Auth failed: User not found' });
        }

        const hashMatch = await bcrypt.compare(req.body.password, fetchedUser.password);
        if (!hashMatch) {
            return res.status(401).json( { message: 'Auth failed: Incorrect password' });
        }

        const token = generateToken(fetchedUser);

        res.status(200).json({
            token: token,
            expiresIn: 3600,
        });
    } catch (error) {
        console.error(error)
        res.status(401).json({
            message: error?.message || 'Auth failed'
        });
    }
});

module.exports = router;