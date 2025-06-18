const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const getAllEquipments = async () => {
    return await sql`SELECT * FROM "Production"."Equipment"`;
};
module.exports = {
    getAllEquipments,
};