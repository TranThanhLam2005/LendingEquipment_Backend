const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

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
            searchOrder === 'Most Recent'
                ? sql`"PurchaseDate" DESC`
                : searchOrder === 'Oldest'
                ? sql`"PurchaseDate" ASC`
                : sql`"ID"`
        }
    `;
};

module.exports = {
    queryAllEquipments,
};