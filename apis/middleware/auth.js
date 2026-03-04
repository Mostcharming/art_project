const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

const verifyViewerToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        if (decoded.type !== 'viewer') {
            return res.status(403).json({ error: 'Only viewers can access this resource' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Viewer token verification error:', error.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

const verifyPublisherToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        if (decoded.type !== 'publisher') {
            return res.status(403).json({ error: 'Only publishers can access this resource' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Publisher token verification error:', error.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = {
    verifyToken,
    verifyViewerToken,
    verifyPublisherToken,
    // Aliases for convenience
    authenticateViewer: verifyViewerToken,
    authenticatePublisher: verifyPublisherToken,
};
