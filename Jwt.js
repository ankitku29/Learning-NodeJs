const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtMiddlewareAuth = function (req, res, next) {
    const tokenAuth = req.headers.authorization;
    // Checking is token present in header 
    if (!tokenAuth) return res.status(401).json({ error: 'token not found' });

    const token = tokenAuth.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SALT);
        req.userDetails = payload;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid Token' });
    }
}

const generateToken = function (payload) {
    return jwt.sign(payload, process.env.JWT_SALT, {expiresIn: 3000});
}

module.exports = { jwtMiddlewareAuth, generateToken };