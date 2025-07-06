const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });


const addChatMessage = async (sessionID, content, messageID, groupID, createAt) => {
    if (!sessionID || !content) {
        throw new Error('Session ID and content are required');
    }
    return await sql`
        INSERT INTO "Production"."GroupChat" ("GroupID","MessageID","CitizenID", "Content", "CreateAt")
        VALUES (
            ${groupID},
            ${messageID},
            (SELECT "User_ID" FROM "Production"."Sessions" WHERE "SessionID" = ${sessionID}),
            ${content},
            ${createAt}
        )
        RETURNING *;
    `;
}

module.exports = {
    addChatMessage,
}