const express = require('express');
const authController = require('../controllers/authController');
const middleware = require('../middleware/middleware');
const router = express.Router();

router.post('/login', authController.login);
// router.post('/register', authController.register);
router.get('/verify-session', authController.verifySession);
router.post('/logout', middleware.verifySessionMiddleware, authController.logout);

module.exports = router;