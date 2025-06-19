const authService = require('../services/authService');

const login = async (req, res) => {
    const { Username, Password } = req.body;

    // Validate request body
    if (!Username || !Password) {
        return res.status(400).json({ error: 'Username and Password are required' });
    }

    try {
        const { token, role } = await authService.login(Username, Password);
        
        // ✅ Set the token as an HTTP-only cookie
        res.cookie('session_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
    
        res.status(200).json({role, message: 'Login successful'});
        
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ error: err.message });
    }
};

// const register = async (req, res) => {
//     const { Username, Password, Role } = req.body;

//     // Validate request body
//     if (!Username || !Password || !Role) {
//         return res.status(400).json({ error: 'Username, Password, and Role are required' });
//     }

//     try {
//         const { token, role } = await authService.register(Username, Password, Role);
//         res.status(201).json({ token, role });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: err.message });
//     }
// };


const verifySession = async (req, res) => {
    const { SessionID } = req.body;

    // Validate request body
    if (!SessionID) {
        return res.status(400).json({ error: 'SessionID is required' });
    }

    try {
        await authService.verifySession(SessionID);
        res.status(200).json({ message: 'Session is valid' });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ error: err.message });
    }
};

module.exports = { login, verifySession };