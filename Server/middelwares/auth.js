const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    
    if (!authHeader) {
        res.status(401).json({ message: "Authentication failed , Token missing" });
    }
    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1]: authHeader;
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next();
    } catch (err) {
        res.status(500).json({ message: 'Authentication failed. Invalid token.' })
    }
}

module.exports = auth