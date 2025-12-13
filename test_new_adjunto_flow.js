const db = require('./db.js');
const tramiteModel = require('./models/tramite.model.js');

async function testNewAdjuntoFlow() {
  try {
    console.log('=== Probando nuevo flujo de adjuntos ===\n');
    
    // 1. Ver trámite antes
    console.log('1. Estado inicial del trámite 11:');
    let tramite = await tramiteModel.getTramiteById(11);
    console.log(`   Adjuntos actuales: ${tramite.adjuntos?.length || 0}`);
    
    // 2. Agregar un adjunto de prueba
    console.log('\n2. Agregando adjunto de prueba...');
    tramite = await tramiteModel.addAdjunto(11, {
      file_url: 'https://res.cloudinary.com/test/image/upload/v123456789/munidigital/tramites/test2.jpg',
      file_type: 'image/jpeg',
      file_size: 55555
    });
    console.log(`   ✅ Adjuntos después de agregar: ${tramite.adjuntos?.length || 0}`);
    
    // 3. Ver adjuntos
    console.log('\n3. Lista de adjuntos:');
    tramite.adjuntos.forEach((adj, i) => {
      console.log(`   ${i + 1}. ${adj.file_url.substring(0, 70)}...`);
    });
    
    // 4. Eliminar el adjunto de prueba
    console.log('\n4. Eliminando adjunto de prueba...');
    tramite = await tramiteModel.removeAdjunto(11, 'https://res.cloudinary.com/test/image/upload/v123456789/munidigital/tramites/test2.jpg');
    console.log(`   ✅ Adjuntos después de eliminar: ${tramite.adjuntos?.length || 0}`);
    
    console.log('\n✅ Todo funciona correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testNewAdjuntoFlow();
