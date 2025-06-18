const express = require('express');
const visitorController = require('../controllers/visitorController');
const router = express.Router();

// Route to get all equipment
router.get('/get_equipment', visitorController.getAllEquipments);

module.exports = router;