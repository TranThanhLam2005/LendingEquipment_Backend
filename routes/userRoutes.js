const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');

// Routes for user operations
router.get('/users', userController.getAllUsers);

// export the router
module.exports = Router;