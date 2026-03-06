const { Pool } = require('pg');

let pool;
let useMock = false;
let mockDb = []; // basic in-memory store if postgres is missing

try {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/wardash',
        // short timeout for fast failover
        connectionTimeoutMillis: 2000,
    });
} catch (e) {
    useMock = true;
}

// Check connection
if (pool) {
    pool.query('SELECT 1').catch((err) => {
        console.warn('⚠️ Could not connect to Postgres DB. Using in-memory mock fallback for development.');
        useMock = true;
    });
}

async function query(text, params) {
    if (useMock) {
        if (text.includes('INSERT INTO intel_feed')) {
            // mock insert
            mockDb.push({
                source_country: params[0],
                source_name: params[1],
                raw_content: params[2],
                translated_content: params[3],
                importance_weight: params[4],
                created_at: new Date()
            });
            return { rowCount: 1 };
        } else if (text.includes('SELECT COUNT(*) as count')) {
            return { rows: [{ count: mockDb.length }] };
        } else if (text.includes('SELECT * FROM intel_feed')) {
            return { rows: mockDb };
        }
        return { rows: [] };
    }
    return pool.query(text, params);
}

module.exports = { query };
