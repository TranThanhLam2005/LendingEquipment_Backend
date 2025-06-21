const equipmentModel = require('../models/equipmentModel');

const queryAllEquipments = async (req, res) => {
    const { searchValue, searchStatus, searchOrder } = req.query;

    try {
        const equipments = await equipmentModel.queryAllEquipments(searchValue, searchStatus, searchOrder);
        res.status(200).json(equipments);
    } catch (err) {
        console.error('Error fetching equipments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = {
    queryAllEquipments,
};