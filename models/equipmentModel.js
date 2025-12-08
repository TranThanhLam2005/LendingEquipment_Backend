const postgres = require("postgres");
const sql = postgres(process.env.DATABASE_URL, {ssl: "require"});

const queryAllEquipments = async (searchValue, searchStatus, searchOrder) => {
  return await sql`
        SELECT * FROM "Production"."Equipment"
        WHERE ${
          searchValue
            ? sql`("Name" ILIKE '%' || ${searchValue} || '%' OR "Description" ILIKE '%' || ${searchValue} || '%')`
            : sql`TRUE`
        }
        AND ${
          searchStatus === "Available" || searchStatus === "Borrowed"
            ? sql`"Status" = ${searchStatus}`
            : sql`TRUE`
        }
        ORDER BY ${
          searchOrder === "Most Recent"
            ? sql`"PurchaseDate" DESC`
            : searchOrder === "Oldest"
            ? sql`"PurchaseDate" ASC`
            : sql`"ID"`
        }
    `;
};

const getEquipmentByParticipantCourse = async (sessionID) => {
  if (!sessionID) {
    throw new Error("SessionID is undefined or invalid");
  }
  return await sql`
        SELECT
            "Equipment"."ID",
            "Equipment"."Name",
            "Equipment"."Status",
            "Equipment"."Type",
            "Equipment"."Condition",
            "Equipment"."PurchaseDate"
        FROM "Production"."Sessions"
        JOIN "Production"."User" ON "Sessions"."User_ID" = "User"."CitizenID"
        JOIN "Production"."Student" ON "User"."CitizenID" = "Student"."CitizenID"
        JOIN "Production"."CourseManagement" ON "CourseManagement"."StudentID" = "Student"."StudentID"
        JOIN "Production"."Course" ON "CourseManagement"."CourseID" = "Course"."CourseID"
        JOIN "Production"."EquipmentManagement" ON "EquipmentManagement"."CourseName" = "Course"."CourseName"
        JOIN "Production"."Equipment" ON "EquipmentManagement"."EquipmentName" = "Equipment"."Name"
        WHERE "Sessions"."SessionID" = ${sessionID}
        ORDER BY "Sessions"."SessionID"
    `;
};

const queryEquipmentByParticipantCourse = async (
  sessionID,
  {searchValue = "", searchStatus = "", searchOrder = ""} = {}
) => {
  if (!sessionID) {
    throw new Error("SessionID is undefined or invalid");
  }

  return await sql`
      SELECT
          e."ID",
          e."Name",
          e."Status",
          e."Type",
          e."Condition",
          e."PurchaseDate",
          e."Description"
      FROM "Production"."Sessions" s
      JOIN "Production"."User" u ON s."User_ID" = u."CitizenID"
      JOIN "Production"."Student" st ON u."CitizenID" = st."CitizenID"
      JOIN "Production"."CourseManagement" cm ON cm."StudentID" = st."StudentID"
      JOIN "Production"."Course" c ON cm."CourseID" = c."CourseID"
      JOIN "Production"."EquipmentManagement" em ON em."CourseName" = c."CourseName"
      JOIN "Production"."Equipment" e ON em."EquipmentName" = e."Name"
      WHERE s."SessionID" = ${sessionID}
        AND ${
          searchValue
            ? sql`(e."Name" ILIKE '%' || ${searchValue} || '%' OR e."Description" ILIKE '%' || ${searchValue} || '%')`
            : sql`TRUE`
        }
        AND ${
          searchStatus === "Available" || searchStatus === "Borrowed"
            ? sql`e."Status" = ${searchStatus}`
            : sql`TRUE`
        }
      ORDER BY ${
        searchOrder === "Most Recent"
          ? sql`e."PurchaseDate" DESC`
          : searchOrder === "Oldest"
          ? sql`e."PurchaseDate" ASC`
          : sql`e."ID"`
      }
    `;
};

const getEquipmentDetail = async (equipmentID, SessionID) => {
  if (!equipmentID) {
    throw new Error("EquipmentID is undefined or invalid");
  }
  if (!SessionID) {
    throw new Error("SessionID is undefined or invalid");
  }

  const result = await sql`
      SELECT 
        "Equipment"."ID",
        "Equipment"."Name",
        "Equipment"."Status",
        "Equipment"."PurchaseDate",
        "Equipment"."Condition",
        "Equipment"."Type",
        "Equipment"."Date Available",
        "Equipment"."Description",
        "Equipment"."Venue",
        "GroupChat"."Content",
        "GroupChat"."CreateAt",
        "User"."FullName",
        "User"."Username",
        "User"."Role", 
        "AcademicStaffUser"."FullName" AS "AcademicStaffName",
        "AcademicStaffUser"."CitizenID" AS "AcademicStaffCitizenID",
        "CurrentUser"."FullName" AS "CurrentUserName"
      FROM "Production"."Equipment"
      LEFT JOIN "Production"."GroupChat" 
        ON "Equipment"."ID" = "GroupChat"."GroupID"
      LEFT JOIN "Production"."User" 
        ON "GroupChat"."CitizenID" = "User"."CitizenID"
      LEFT JOIN "Production"."EquipmentManagement"
        ON "Equipment"."Name" = "EquipmentManagement"."EquipmentName"
      LEFT JOIN "Production"."Course"
        ON "EquipmentManagement"."CourseName" = "Course"."CourseName"
      LEFT JOIN "Production"."AcademicStaff"
        ON "Course"."AcademicStaffID" = "AcademicStaff"."StaffID"
      LEFT JOIN "Production"."User" AS "AcademicStaffUser"
        ON "AcademicStaff"."CitizenID" = "AcademicStaffUser"."CitizenID"
      LEFT JOIN "Production"."Sessions"
        ON "Sessions"."SessionID" = ${SessionID}
      LEFT JOIN "Production"."User" AS "CurrentUser"
        ON "Sessions"."User_ID" = "CurrentUser"."CitizenID"
      WHERE "Equipment"."ID" = ${equipmentID}
    `;

  if (result.length === 0) return null;

  // Take shared equipment data from first row
  const {
    ID,
    Name,
    Status,
    PurchaseDate,
    Condition,
    Type,
    "Date Available": DateAvailable,
    Description,
    Venue,
    AcademicStaffName,
    AcademicStaffCitizenID,
    CurrentUserName,
  } = result[0];

  // Map chat messages to sender objects
  const historyComments = Array.from(
    new Map(
      result
        .filter((row) => row.Content !== null)
        .map((row) => [
          `${row.Username}-${row.CreateAt}`,
          {
            userName: row.Username,
            role: row.Role,
            fullName: row.FullName,
            createAt: row.CreateAt,
            content: row.Content,
          },
        ])
    ).values()
  );

  return {
    ID,
    Name,
    Status,
    PurchaseDate,
    Condition,
    Type,
    DateAvailable,
    Description,
    Venue,
    AcademicStaffName,
    AcademicStaffCitizenID,
    CurrentUserName,
    historyComments,
  };
};

const updateEquipmentStatus = async (equipmentID, newStatus) => {
  return await sql`
    UPDATE "Production"."Equipment"
    SET "Status" = ${newStatus}
    WHERE "ID" = ${equipmentID}
    RETURNING *;
    `;
}

const getSuperviseInfoByEquipmentID = async (equipmentID) => {
  const result = await sql`
    SELECT
      "AcademicStaffUser"."FullName" AS "AcademicStaffName",
      "AcademicStaffUser"."CitizenID" AS "AcademicStaffCitizenID"
    FROM "Production"."Equipment" 
    LEFT JOIN "Production"."EquipmentManagement"
      ON "Equipment"."Name" = "EquipmentManagement"."EquipmentName"
    LEFT JOIN "Production"."Course"
      ON "EquipmentManagement"."CourseName" = "Course"."CourseName"
    LEFT JOIN "Production"."AcademicStaff"
      ON "Course"."AcademicStaffID" = "AcademicStaff"."StaffID"
    LEFT JOIN "Production"."User" AS "AcademicStaffUser"
      ON "AcademicStaff"."CitizenID" = "AcademicStaffUser"."CitizenID"
    WHERE "Equipment"."ID" = ${equipmentID}
    `;
  return result.length > 0 ? result[0] : null;
}

const queryTest = async () => {
  return await sql`
    SELECT s."SessionID", u."FullName", st."StudentID"
        FROM "Production"."Sessions" s
        JOIN "Production"."User" u ON s."User_ID" = u."CitizenID"
        JOIN "Production"."Student" st ON u."CitizenID" = st."StudentID" -- change if needed
        WHERE s."SessionID" = 'a49bb74b60512aaaba90d1b351f08f876ea2d9da1d9fdcbfb01711bcb3331b59';
        `;
};

const getEquipmentNameByID = async (equipmentID) => {
  const result = await sql`
    SELECT "Name" FROM "Production"."Equipment"
    WHERE "ID" = ${equipmentID};
    `;
  return result.length > 0 ? result[0].Name : null;
};
module.exports = {
  queryAllEquipments,
  queryTest,
  getEquipmentByParticipantCourse,
  queryEquipmentByParticipantCourse,
  getEquipmentDetail,
  updateEquipmentStatus,
  getEquipmentNameByID,
  getSuperviseInfoByEquipmentID,
};
