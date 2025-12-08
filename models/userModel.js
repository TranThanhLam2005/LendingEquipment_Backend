const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// Fetch user by username 
const getUserByUsername = async (Username) => {
    return await sql`
        SELECT * FROM "Production"."User" WHERE "Username" = ${Username}   
    `;
}

const getFullNameByCitizenID = async (CitizenID) => {
    const result = await sql`
        SELECT "FullName" FROM "Production"."User"
        WHERE "CitizenID" = ${CitizenID}
    `;
    return result.length > 0 ? result[0].FullName : null;
}

const getUserBySessionID = async (SessionID) => {
    if (!SessionID) {
        throw new Error('SessionID is undefined');
    }
    const result = await sql`
        SELECT "User"."Username", "User"."FullName", "User"."Role", "User"."CitizenID"
        FROM "Production"."User"
        JOIN "Production"."Sessions" ON "Production"."User"."CitizenID" = "Production"."Sessions"."User_ID"
        WHERE "Production"."Sessions"."SessionID" = ${SessionID}
    `;
    return result[0]; 
}

// add new user
const addUser = async (Username, Password, Role) => {
    return await sql`
    INSERT INTO "Production"."User" ("Username", "Password", "Role") 
    VALUES (${Username}, ${Password}, ${Role}) 
    RETURNING *;
    `;
}



module.exports = {
    getUserByUsername,
    getUserBySessionID,
    addUser, 
    getFullNameByCitizenID,
};