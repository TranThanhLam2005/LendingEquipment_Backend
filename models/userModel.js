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

module.exports = {
    getUserByUsername,
    addUser
};