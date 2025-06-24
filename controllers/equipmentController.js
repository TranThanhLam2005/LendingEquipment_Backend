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

const getEquipmentByParticipantCourse = async (req, res) => {
    const SessionID = req.cookies.token;

    try {
        const equipments = await equipmentModel.getEquipmentByParticipantCourse(SessionID);
        res.status(200).json(equipments);
    } catch (err) {
        console.error('Error fetching participant course equipments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const queryEquipmentByParticipantCourse = async (req, res) => {
    const SessionID = req.cookies.token;
    const { searchValue, searchStatus, searchOrder } = req.query;

    try {
        const equipments = await equipmentModel.queryEquipmentByParticipantCourse(SessionID, { searchValue, searchStatus, searchOrder });
        res.status(200).json(equipments);
    } catch (err) {
        console.error('Error fetching participant course equipments with filters:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const test = async (req, res) => {
    try {
        const result = await equipmentModel.queryTest();
        res.status(200).json(result);
    } catch (err) {

        console.error('Error in test function:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    queryAllEquipments,
    getEquipmentByParticipantCourse, 
    queryEquipmentByParticipantCourse,
    test
};