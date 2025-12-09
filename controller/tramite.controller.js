const { validationResult } = require('express-validator');


async function getTramite(req, res) {
const id = parseInt(req.params.id);
const tramite = await tramiteModel.getTramiteById(id);
if (!tramite) return res.status(404).json({ message: 'Trámite no encontrado' });
if (tramite.user_id !== req.user.id) return res.status(403).json({ message: 'Acceso denegado' });
res.json(tramite);
}


async function updateTramite(req, res) {
const id = parseInt(req.params.id);
const existente = await tramiteModel.getTramiteById(id);
if (!existente) return res.status(404).json({ message: 'Trámite no encontrado' });
if (existente.user_id !== req.user.id) return res.status(403).json({ message: 'Acceso denegado' });


// solo permitir ciertos campos
const allowed = ['title', 'description', 'status'];
const fields = {};
for (const key of allowed) if (req.body[key] !== undefined) fields[key] = req.body[key];


const updated = await tramiteModel.updateTramite(id, fields);
res.json(updated);
}


async function deleteTramite(req, res) {
const id = parseInt(req.params.id);
const existente = await tramiteModel.getTramiteById(id);
if (!existente) return res.status(404).json({ message: 'Trámite no encontrado' });
if (existente.user_id !== req.user.id) return res.status(403).json({ message: 'Acceso denegado' });


await tramiteModel.softDeleteTramite(id);
res.status(204).send();
}


module.exports = { createTramite, listTramites, getTramite, updateTramite, deleteTramite };
