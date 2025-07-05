const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });


const addChatMessage = async (sessionID, sender, message) => {
    return await sql`
        INSERT INTO "Production"."Chat" ("SessionID", "Sender", "Message")
        VALUES (${sessionID}, ${sender}, ${message})
        RETURNING *;
    `;
}

module.exports = {
    addChatMessage,
}