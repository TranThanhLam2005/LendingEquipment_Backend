const visitorModel = require('../models/visitorModel');

const getAllEquipments = async (req, res) => {
    try {
        const equipments = await visitorModel.getAllEquipments();
        res.status(200).json(equipments);
    } catch (err) {
        console.error('Error fetching equipments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    getAllEquipments,
};
