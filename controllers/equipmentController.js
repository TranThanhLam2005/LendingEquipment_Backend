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

const getEquipmentDetail = async (req, res) => {
    const equipmentID = req.params.equipmentID;
    const SessionID = req.cookies.token;
    
    try {
        const equipmentDetail = await equipmentModel.getEquipmentDetail(equipmentID, SessionID);
        if (!equipmentDetail) {
            return res.status(404).json({ error: 'Equipment not found' });
        }
        res.status(200).json(equipmentDetail);
    } catch (err) {
        console.error('Error fetching equipment detail:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getSuperviseInfoByEquipmentID = async (req, res) => {
    const equipmentID = req.query.equipmentID;

    try {
        const superviseInfo = await equipmentModel.getSuperviseInfoByEquipmentID(equipmentID);
        if (!superviseInfo) {
            return res.status(404).json({ error: 'Supervise info not found' });
        }
        res.status(200).json(superviseInfo);
    } catch (err) {
        console.error('Error fetching supervise info by equipment ID:', err);
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
    getEquipmentDetail,
    getSuperviseInfoByEquipmentID,
    test
};