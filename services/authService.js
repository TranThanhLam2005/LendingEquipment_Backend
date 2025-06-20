const utils = require('../utils/util');
const userModel = require('../models/userModel');

// login service
const login = async (Username, Password) => {
    // Fetch user by username
    const user = await userModel.getUserByUsername(Username);
    // Check if user exists
    if (user.length === 0) {
        const error = new Error('User not found');
        error.statusCode = 404; // Not Found
        throw error;
    }

    const compare = await utils.comparePassword(Password, user[0].Password);
    if (compare.match === false) {
        const error = new Error('Incorrect password');
        error.statusCode = 401; // Unauthorized
        throw error;
    }

    // Generate token and role
    const token = utils.generateSessionID();
    await userModel.addSession(token, user[0].CitizenID);
    const role = user[0].Role;

    return { token, role };
}

// const register = async (Username, Password, Role) => {
//     // Hash the password
//     const hashedPassword = utils.hashString(Password);

//     // Add new user
//     const newUser = await userModel.addUser(Username, hashedPassword, Role);
    
//     // Generate token and role
//     const token = `token-${newUser[0].Username}`;
//     const role = newUser[0].Role;

//     return { token, role };
// }

const verifySession = async (SessionID) => {
    // Verify session
    const session = await userModel.verifySession(SessionID);
    if (session.length === 0) {
        throw new Error('Session is expired or invalid');
    }
}

module.exports = {
    login,
    verifySession
};
