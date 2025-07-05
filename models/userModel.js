const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// Fetch user by username 
const getUserByUsername = async (Username) => {
    return await sql`
        SELECT * FROM "Production"."User" WHERE "Username" = ${Username}   
    `;
}


// add new user
const addUser = async (Username, Password, Role) => {
    return await sql`
    INSERT INTO "Production"."User" ("Username", "Password", "Role") 
    VALUES (${Username}, ${Password}, ${Role}) 
    RETURNING *;
    `;
}

const getParticipantCourses = async (SessionID) => {
    return await sql`
        SELECT 
        "Course"."CourseID", "Course"."CourseName", "Course"."DateStart", 
        "Course"."DateEnd", "Course"."LectureDate", "Course"."Room", "Course"."Description",
        "User"."FullName" AS "AcademicStaffName"
        FROM "Production"."Course"
        JOIN "Production"."CourseManagement" ON "Production"."Course"."CourseID" = "Production"."CourseManagement"."CourseID"
        JOIN "Production"."AcademicStaff" ON "Production"."Course"."AcademicStaffID" = "Production"."AcademicStaff"."StaffID"
        JOIN "Production"."User" ON "Production"."AcademicStaff"."CitizenID" = "Production"."User"."CitizenID"
        JOIN "Production"."Student" ON "Production"."CourseManagement"."StudentID" = "Production"."Student"."StudentID"
        JOIN "Production"."Sessions" ON "Production"."Student"."CitizenID" = "Production"."Sessions"."User_ID"
        WHERE "Production"."Sessions"."SessionID" = ${SessionID}
    `;
}

const getCourseDetail = async (CourseID) => {
    if (!CourseID) {
        throw new Error('CourseID is undefined');
    }

    const result = await sql`
        SELECT
            c."CourseID",
            c."CourseName",
            c."DateStart",
            c."DateEnd",
            c."LectureDate",
            c."Room",
            c."Description",
            u."FullName" AS "AcademicStaffName",

            json_agg(
                DISTINCT jsonb_build_object(
                    'Name', e."Name",
                    'Status', e."Status",
                    'PurchaseDate', e."PurchaseDate",
                    'Condition', e."Condition",
                    'Type', e."Type"
                )
            ) AS "Equipments",

            json_agg(
                DISTINCT su."FullName"
            ) AS "StudentNames"

        FROM "Production"."Course" c
        JOIN "Production"."AcademicStaff" a ON c."AcademicStaffID" = a."StaffID"
        JOIN "Production"."User" u ON a."CitizenID" = u."CitizenID"
        JOIN "Production"."CourseManagement" cm ON c."CourseID" = cm."CourseID"
        JOIN "Production"."Student" s ON cm."StudentID" = s."StudentID"
        JOIN "Production"."User" su ON s."CitizenID" = su."CitizenID"
        JOIN "Production"."EquipmentManagement" em ON em."CourseName" = c."CourseName"
        JOIN "Production"."Equipment" e ON em."EquipmentName" = e."Name"

        WHERE c."CourseID" = ${CourseID}

        GROUP BY
            c."CourseID", c."CourseName", c."DateStart", c."DateEnd", c."LectureDate",
            c."Room", c."Description", u."FullName";
    `;

    return result[0];
};


module.exports = {
    getUserByUsername,
    addUser, 
    getParticipantCourses,
    getCourseDetail,
};