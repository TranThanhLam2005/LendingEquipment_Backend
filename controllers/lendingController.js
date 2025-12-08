const lendingModel = require("../models/lendingModel");
const equipmentModel = require("../models/equipmentModel");
const userModel = require("../models/userModel");
const addLendingRecord = async (req, res) => {
  const {
    BorrowerID,
    SuperviseID,
    EquipmentID,
    BorrowDate,
    ReturnDate,
    Purpose,
    Status,
  } = req.body;
  try {
    const newRecord = await lendingModel.addLendingRecord(
      BorrowerID,
      SuperviseID,
      EquipmentID,
      BorrowDate,
      ReturnDate,
      Purpose,
      Status
    );
    await equipmentModel.updateEquipmentStatus(EquipmentID, Status);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error("Error adding lending record:", err);
    res.status(500).json({error: "Internal Server Error"});
  }
};
const getLendingRecordsBySessionID = async (req, res) => {
  const SessionID = req.cookies.token;
  try {
    const user = await userModel.getUserBySessionID(SessionID);
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    const lendingRecords = await lendingModel.getLendingRecordsByBorrower(
      user.CitizenID
    );
    const detailedRecords = await Promise.all(
      lendingRecords.map(async (record) => {
        const equipmentName = await equipmentModel.getEquipmentNameByID(
          record.EquipmentID
        );
        const supervisorName = await userModel.getFullNameByCitizenID(
          record.SuperviseID
        );
        return {
          ...record,
          EquipmentName: equipmentName,
          SupervisorName: supervisorName,
        };
      })
    );
    res.status(200).json(detailedRecords);
  } catch (err) {
    console.error("Error fetching lending records:", err);
    res.status(500).json({error: "Internal Server Error"});
  }
};

module.exports = {
  addLendingRecord,
  getLendingRecordsBySessionID,
};
