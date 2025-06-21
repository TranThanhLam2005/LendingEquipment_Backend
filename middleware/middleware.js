const authService = require('../services/authService');

const verifySessionMiddleware = async (req, res, next) => {
    const SessionID = req.cookies.token;

    try {
        await authService.verifySession(SessionID); // Reuse shared logic
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ error: err.message });
    }
};

module.exports = {verifySessionMiddleware};