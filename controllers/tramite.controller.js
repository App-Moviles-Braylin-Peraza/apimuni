const { validationResult } = require('express-validator');
const tramiteModel = require('../models/tramite.model');

async function createTramite(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  const user_id = req.user.id;

  try {
    const tramite = await tramiteModel.createTramite({ title, description, user_id });
    res.status(201).json(tramite);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear trámite', error: error.message });
  }
}

async function listTramites(req, res) {
  const user_id = req.user.id;
  const { page, limit, status, sort, order } = req.query;

  try {
    const tramites = await tramiteModel.getTramitesByUser({
      user_id,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      sort,
      order
    });
    res.json(tramites);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener trámites', error: error.message });
  }
}

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
