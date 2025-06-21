const express = require('express');
const visitorController = require('../controllers/visitorController');
const equipmentController = require('../controllers/equipmentController');
const router = express.Router();

// Route to get all equipment
router.get('/get_equipment', visitorController.getAllEquipments);
router.get('/query_equipment', equipmentController.queryAllEquipments);


module.exports = router;