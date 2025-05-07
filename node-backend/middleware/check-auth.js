const jwt = require('jsonwebtoken');
const defaultSecret = require('../utilities/auth-utils')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        const decodedToken = jwt.verify(token, defaultSecret);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Auth failed' });
    }
}