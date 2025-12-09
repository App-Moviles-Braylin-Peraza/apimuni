require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
connectionString: process.env.DATABASE_URL,
// Si usas SSL en producción en Render/Heroku, podrías necesitar:
// ssl: { rejectUnauthorized: false }
});


module.exports = {
query: (text, params) => pool.query(text, params),
pool,
};