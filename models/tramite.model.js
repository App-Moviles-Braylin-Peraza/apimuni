const db = require('../db.js');
async function createTramite({ title, description, user_id }) {
const res = await db.query(
`INSERT INTO tramites (title, description, user_id) VALUES ($1, $2, $3) RETURNING ${defaultFields}`,
[title, description, user_id]
);
return res.rows[0];
}


async function getTramitesByUser({ user_id, page = 1, limit = 20, status, sort = 'last_update_date', order = 'DESC' }) {
const offset = (page - 1) * limit;
const params = [user_id];
let where = 'user_id = $1 AND is_deleted = false';


if (status) {
params.push(status);
where += ` AND status = $${params.length}`;
}


const q = `SELECT ${defaultFields} FROM tramites WHERE ${where} ORDER BY ${sort} ${order} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
params.push(limit, offset);
const res = await db.query(q, params);
return res.rows;
}


async function getTramiteById(id) {
const res = await db.query(`SELECT ${defaultFields} FROM tramites WHERE id = $1 AND is_deleted = false`, [id]);
return res.rows[0];
}


async function updateTramite(id, fields = {}) {
// Build dynamic SET
const keys = Object.keys(fields);
if (keys.length === 0) return getTramiteById(id);


const sets = keys.map((k, i) => `${k} = $${i + 1}`);
const params = keys.map(k => fields[k]);
// append last_update_date
sets.push(`last_update_date = now()`);


const q = `UPDATE tramites SET ${sets.join(', ')} WHERE id = $${keys.length + 1} RETURNING ${defaultFields}`;
params.push(id);
const res = await db.query(q, params);
return res.rows[0];
}


async function softDeleteTramite(id) {
const res = await db.query(
`UPDATE tramites SET is_deleted = true, last_update_date = now() WHERE id = $1 RETURNING id`,
[id]
);
return res.rowCount > 0;
}


module.exports = {
createTramite,
getTramitesByUser,
getTramiteById,
updateTramite,
softDeleteTramite,
};