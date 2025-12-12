const db = require('../db.js');


async function createUser({ username, password_hash, full_name }) {
const res = await db.query(
'INSERT INTO users (username, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, username, full_name, created_at',
[username, password_hash, full_name]
);
return res.rows[0];
}


async function findByUsername(username) {
const res = await db.query('SELECT * FROM users WHERE username = $1', [username]);
return res.rows[0];
}


async function findById(id) {
const res = await db.query('SELECT id, username, full_name, created_at FROM users WHERE id = $1', [id]);
return res.rows[0];
}


module.exports = { createUser, findByUsername, findById };