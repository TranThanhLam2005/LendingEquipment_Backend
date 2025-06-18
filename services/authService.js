const utils = require('../utils/util');
const userModel = require('../models/userModel');
// login service
const login = async (Username, Password) => {
    // Fetch user by username
    const user = await userModel.getUserByUsername(Username);
    
    // Check if user exists
    if (user.length === 0) {
        throw new Error('User not found');
    }

    // Compare password
    const isPasswordValid = utils.compareHash(Password, user[0].Password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    // Generate token and role
    const token = `token-${user[0].Username}`;
    const role = user[0].Role;

    return { token, role };
}

const register = async (Username, Password, Role) => {
    // Hash the password
    const hashedPassword = utils.hashString(Password);

    // Add new user
    const newUser = await userModel.addUser(Username, hashedPassword, Role);
    
    // Generate token and role
    const token = `token-${newUser[0].Username}`;
    const role = newUser[0].Role;

    return { token, role };
}


module.exports = {
    login,
    register
};
