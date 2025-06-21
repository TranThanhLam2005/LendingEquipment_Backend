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


module.exports = {
    getUserByUsername,
    addUser, 
    getParticipantCourses
};