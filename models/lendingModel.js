const postgres = require("postgres");
const sql = postgres(process.env.DATABASE_URL, {ssl: "require"});

const addLendingRecord = async (
  BorrowerID,
  SuperviseID,
  EquipmentID,
  BorrowDate,
  ReturnDate,
  Purpose,
  Status
) => {
  return await sql`
    INSERT INTO "Production"."LendingRecord"
    ("BorrowerID", "SuperviseID", "EquipmentID", "BorrowDate", "ReturnDate", "Purpose", "Status")
    VALUES
    (${BorrowerID}, ${SuperviseID}, ${EquipmentID}, ${BorrowDate}, ${ReturnDate}, ${Purpose}, ${Status})
    RETURNING *;
    `;
};

const getLendingRecordsByBorrower = async (BorrowerID) => {
  return await sql`
    SELECT * FROM "Production"."LendingRecord"
    WHERE "BorrowerID" = ${BorrowerID};
    `;
}

module.exports = {
  addLendingRecord,
    getLendingRecordsByBorrower,
};
