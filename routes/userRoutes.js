const express = require('express');
const userController = require('../controllers/userController');
const equipmentController = require('../controllers/equipmentController');
const courseController = require('../controllers/courseController');
const lendingController = require('../controllers/lendingController');
const middleware = require('../middleware/middleware');
const router = express.Router();

// Routes for user operations
router.get('/get_user_by_session', middleware.verifySessionMiddleware, userController.getUserBySessionID);
router.get('/get_participant_courses',middleware.verifySessionMiddleware, courseController.getParticipantCourses);
router.get('/get_participant_course_detail/:courseID', middleware.verifySessionMiddleware, courseController.getParticipantCourseDetails);
router.get('/get_participant_equipment', middleware.verifySessionMiddleware, equipmentController.getEquipmentByParticipantCourse);
router.get('/query_participant_equipment', middleware.verifySessionMiddleware, equipmentController.queryEquipmentByParticipantCourse);
router.get('/get_participant_equipment_detail/:equipmentID', middleware.verifySessionMiddleware, equipmentController.getEquipmentDetail);
router.post('/add_lending_record', middleware.verifySessionMiddleware, lendingController.addLendingRecord);
router.get('/get_lending_records', middleware.verifySessionMiddleware, lendingController.getLendingRecordsBySessionID);
router.get('/get_supervise_info', middleware.verifySessionMiddleware, equipmentController.getSuperviseInfoByEquipmentID);
router.get('/test', equipmentController.test);

// export the router
module.exports = router;