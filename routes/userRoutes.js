const express = require('express');
const userController = require('../controllers/userController');
const equipmentController = require('../controllers/equipmentController');
const middleware = require('../middleware/middleware');
const router = express.Router();

// Routes for user operations
router.get('/get_user_by_session', middleware.verifySessionMiddleware, userController.getUserBySessionID);
router.get('/get_participant_courses',middleware.verifySessionMiddleware, userController.getParticipantCourses);
router.get('/get_participant_course_detail/:courseID', middleware.verifySessionMiddleware, userController.getParticipantCourseDetails);
router.get('/get_participant_equipment', middleware.verifySessionMiddleware, equipmentController.getEquipmentByParticipantCourse);
router.get('/query_participant_equipment', middleware.verifySessionMiddleware, equipmentController.queryEquipmentByParticipantCourse);
router.get('/get_participant_equipment_detail/:equipmentID', middleware.verifySessionMiddleware, equipmentController.getEquipmentDetail);
router.get('/test', equipmentController.test);

// export the router
module.exports = router;