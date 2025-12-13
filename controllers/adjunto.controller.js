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

    // Agregar el adjunto al trámite
    const tramiteActualizado = await tramiteModel.addAdjunto(tramite_id, {
      file_url: req.file.path,
      file_type: req.file.mimetype,
      file_size: req.file.size,
    });

    res.status(201).json({
      message: 'Adjunto subido exitosamente',
      tramite: tramiteActualizado
    });
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

    res.json(tramite.adjuntos || []);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener adjuntos', error: error.message });
  }
}

async function deleteAdjunto(req, res) {
  try {
    const tramite_id = parseInt(req.params.tramite_id);
    const file_url = req.body.file_url;
    
    if (!file_url) {
      return res.status(400).json({ message: 'Se requiere file_url en el body' });
    }

    // Verificar que el trámite existe y pertenece al usuario
    const tramite = await tramiteModel.getTramiteById(tramite_id);
    if (!tramite) {
      return res.status(404).json({ message: 'Trámite no encontrado' });
    }
    if (tramite.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Verificar que el adjunto existe
    const adjuntoExists = tramite.adjuntos?.some(adj => adj.file_url === file_url);
    if (!adjuntoExists) {
      return res.status(404).json({ message: 'Adjunto no encontrado' });
    }

    // Extraer el public_id de Cloudinary de la URL
    const urlParts = file_url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `munidigital/tramites/${filename.split('.')[0]}`;

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Eliminar del array de adjuntos
    await tramiteModel.removeAdjunto(tramite_id, file_url);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar adjunto', error: error.message });
  }
}

module.exports = { uploadAdjunto, getAdjuntos, deleteAdjunto };
