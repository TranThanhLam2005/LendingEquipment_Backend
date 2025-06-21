const express = require('express');
const userController = require('../controllers/userController');
const middleware = require('../middleware/middleware');
const router = express.Router();

// Routes for user operations
router.get('/get_participant_courses',middleware.verifySessionMiddleware, userController.getParticipantCourses);

// export the router
module.exports = router;