const crypto = require("crypto");
const bcrypt = require('bcrypt');
const saltRounds = 10;


function hashPassword(password) {
  bcrypt.hash(password, saltRounds, function(err, hash) {
    return {error: err, hash: hash};
  })
};

async function comparePassword(Password, storedHash) {
  try {
      const match = await bcrypt.compare(Password, storedHash);
      return { match };
  } catch (err) {
      return { match: false, err };
  }
}


function generateSessionID() {
  return crypto.randomBytes(32).toString("hex");
}
function generateMessageID() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = {
  hashPassword,
  comparePassword,
  generateSessionID,
  generateMessageID
};



