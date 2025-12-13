const adjuntoModel = require('../models/adjunto.model.js');
const tramiteModel = require('../models/tramite.model.js');
const { cloudinary } = require('../config/cloudinary.config.js');

async function uploadAdjunto(req, res) {
  try {
    const tramite_id = parseInt(req.params.tramite_id);
    
    // Verificar que el trámite existe y pertenece al usuario
    const tramite = await tramiteModel.getTramiteById(tramite_id);
    if (!tramite) {
      return res.status(404).json({ message: 'Trámite no encontrado' });
    }
    if (tramite.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
    }

    // Crear el registro del adjunto en la base de datos
    const adjunto = await adjuntoModel.createAdjunto({
      tramite_id,
      file_url: req.file.path,
      file_type: req.file.mimetype,
      file_size: req.file.size,
    });

    res.status(201).json(adjunto);
  } catch (error) {
    res.status(500).json({ message: 'Error al subir adjunto', error: error.message });
  }
}

async function getAdjuntos(req, res) {
  try {
    const tramite_id = parseInt(req.params.tramite_id);
    
    // Verificar que el trámite existe y pertenece al usuario
    const tramite = await tramiteModel.getTramiteById(tramite_id);
    if (!tramite) {
      return res.status(404).json({ message: 'Trámite no encontrado' });
    }
    if (tramite.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const adjuntos = await adjuntoModel.getAdjuntosByTramite(tramite_id);
    res.json(adjuntos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener adjuntos', error: error.message });
  }
}

async function deleteAdjunto(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    // Obtener el adjunto
    const adjunto = await adjuntoModel.getAdjuntoById(id);
    if (!adjunto) {
      return res.status(404).json({ message: 'Adjunto no encontrado' });
    }

    // Verificar que el trámite pertenece al usuario
    const tramite = await tramiteModel.getTramiteById(adjunto.tramite_id);
    if (tramite.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Extraer el public_id de Cloudinary de la URL
    const urlParts = adjunto.file_url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `munidigital/tramites/${filename.split('.')[0]}`;

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Eliminar de la base de datos
    await adjuntoModel.deleteAdjunto(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar adjunto', error: error.message });
  }
}

module.exports = { uploadAdjunto, getAdjuntos, deleteAdjunto };
