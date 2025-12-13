const db = require('../db.js');

const defaultFields = 'id, tramite_id, file_url, file_type, file_size, uploaded_at';

async function createAdjunto({ tramite_id, file_url, file_type, file_size }) {
  const res = await db.query(
    `INSERT INTO tramite_adjuntos (tramite_id, file_url, file_type, file_size) 
     VALUES ($1, $2, $3, $4) RETURNING ${defaultFields}`,
    [tramite_id, file_url, file_type, file_size]
  );
  return res.rows[0];
}

async function getAdjuntosByTramite(tramite_id) {
  const res = await db.query(
    `SELECT ${defaultFields} FROM tramite_adjuntos WHERE tramite_id = $1 ORDER BY uploaded_at DESC`,
    [tramite_id]
  );
  return res.rows;
}

async function getAdjuntoById(id) {
  const res = await db.query(
    `SELECT ${defaultFields} FROM tramite_adjuntos WHERE id = $1`,
    [id]
  );
  return res.rows[0];
}

async function deleteAdjunto(id) {
  const res = await db.query(
    `DELETE FROM tramite_adjuntos WHERE id = $1 RETURNING id`,
    [id]
  );
  return res.rowCount > 0;
}

module.exports = {
  createAdjunto,
  getAdjuntosByTramite,
  getAdjuntoById,
  deleteAdjunto,
};
