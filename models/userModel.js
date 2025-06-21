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

// Add new session
const addSession = async (SessionID, UserID) => {
    if (!SessionID || !UserID) {
        throw new Error('SessionID or UserID is undefined');
    }

    const createAt = new Date().toISOString();
    const lastActive = createAt;
    const isActive = true;
    return await sql`
        INSERT INTO "Production"."Sessions" ("SessionID", "User_ID", "CreateAt", "LastActive", "IsActive") 
        VALUES (${SessionID}, ${UserID}, ${createAt}, ${lastActive}, ${isActive}) 
        RETURNING *;
    `;
};

const inActiveSession = async (SessionID) => {
    if (!SessionID) {
        throw new Error('SessionID is undefined');
    }
    return await sql`
        UPDATE "Production"."Sessions"
        SET "IsActive" = FALSE
        WHERE "SessionID" = ${SessionID}
        RETURNING *;
    `;
};

const verifySession = async (SessionID) => {
    const result =  await sql`
        SELECT * FROM "Production"."Sessions"
        WHERE "SessionID" = ${SessionID}
          AND "IsActive" = TRUE
          AND "LastActive" > NOW() - INTERVAL '30 minutes'
          AND "CreateAt" > NOW() - INTERVAL '24 hours'
    `;

    if (result.length > 0) {
        const session = result[0];
        const lastActive = session.LastActive;
        const now = new Date();
        const minutesSinceLastActive = Math.floor((now - new Date(lastActive)) / 60000);        
        if (minutesSinceLastActive > 5) {
            await sql`
                UPDATE "Production"."Sessions"
                SET "LastActive" = NOW()
                WHERE "SessionID" = ${SessionID}
            `;
        }
        return session; 
    } else {
        await sql`
            UPDATE "Production"."Sessions"
            SET "IsActive" = FALSE
            WHERE "SessionID" = ${SessionID}
        `;
        return null; 
    }
};



module.exports = {
    getUserByUsername,
    addUser, 
    addSession,
    inActiveSession,
    verifySession,
};