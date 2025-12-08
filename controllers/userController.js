const userModel = require("../models/userModel");

const getUserBySessionID = async (req, res) => {
  const SessionID = req.cookies.token;

  try {
    const user = await userModel.getUserBySessionID(SessionID);
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by session ID:", err);
    res.status(500).json({error: "Internal Server Error"});
  }
};

module.exports = {
  getUserBySessionID,
};
