// middleware/auth.js
const jwt = require('jsonwebtoken');

// Ideally, import this from a shared config or .env file
const JWT_SECRET = 'your_jwt_secret_key'; 

function authenticateToken(req, res, next) {
    // 1. Get the token from the header (Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded; 
        
        next(); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token has expired' });
        }
        return res.status(403).json({ message: 'Invalid access token' });
    }
}

module.exports = authenticateToken;