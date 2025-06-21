const authService = require('../services/authService');

const login = async (req, res) => {
    const { Username, Password } = req.body;

    // Validate request body
    if (!Username || !Password) {
        return res.status(400).json({ error: 'Username and Password are required' });
    }

    try {
        const { token, role } = await authService.login(Username, Password);
        
        // For dev:
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600 * 1000,
        });
          
        res.status(200).json({role, message: 'Login successful'});
    } catch (err) {
        const status = err.statusCode || 500; // Default to 500 if no status code is set
        return res.status(status).json({ error: err.message });
    }
};

const logout = async (req, res) => {
    const SessionID = req.cookies.token;

    // Validate SessionID
    if (!SessionID) {
        return res.status(400).json({ error: 'SessionID is required' });
    }
    try {
        await authService.logout(SessionID);
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}
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
    const SessionID = req.cookies.token;
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



module.exports = { login, logout, verifySession };