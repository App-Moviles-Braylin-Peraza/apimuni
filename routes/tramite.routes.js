const express = require('express');
const router = express.Router();
const tramiteCtrl = require('../controllers/tramite.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /tramites - Listar trámites del usuario
router.get('/', tramiteCtrl.listTramites);

// POST /tramites - Crear nuevo trámite
router.post('/', tramiteCtrl.createTramite);

// GET /tramites/:id - Obtener un trámite
router.get('/:id', tramiteCtrl.getTramite);

// PUT /tramites/:id - Actualizar trámite
router.put('/:id', tramiteCtrl.updateTramite);

// DELETE /tramites/:id - Eliminar trámite
router.delete('/:id', tramiteCtrl.deleteTramite);

module.exports = router;
