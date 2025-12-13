const express = require('express');
const router = express.Router();
const adjuntoCtrl = require('../controllers/adjunto.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');
const { upload } = require('../config/cloudinary.config.js');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /tramites/:tramite_id/adjuntos - Subir foto a un trámite
router.post('/:tramite_id/adjuntos', upload.single('foto'), adjuntoCtrl.uploadAdjunto);

// GET /tramites/:tramite_id/adjuntos - Listar adjuntos de un trámite
router.get('/:tramite_id/adjuntos', adjuntoCtrl.getAdjuntos);

// DELETE /adjuntos/:id - Eliminar un adjunto
router.delete('/adjuntos/:id', adjuntoCtrl.deleteAdjunto);

module.exports = router;
