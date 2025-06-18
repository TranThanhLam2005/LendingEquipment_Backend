const User = require('../models/userModel');

exports.getAllUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send('Error retrieving users');
        res.status(200).json(users);
    });
};