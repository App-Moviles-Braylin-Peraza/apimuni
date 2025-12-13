const db = require('./db.js');

async function testAdjuntoInsert() {
  try {
    console.log('=== Probando inserción de adjunto ===\n');
    
    // Datos de prueba simulando lo que vendría de Cloudinary
    const testData = {
      tramite_id: 11, // Asegúrate que este trámite exista
      file_url: 'https://res.cloudinary.com/test/image/upload/v123456789/munidigital/tramites/test.jpg',
      file_type: 'image/jpeg',
      file_size: 245678
    };
    
    console.log('Datos a insertar:', testData);
    
    const result = await db.query(
      `INSERT INTO tramite_adjuntos (tramite_id, file_url, file_type, file_size) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, tramite_id, file_url, file_type, file_size, uploaded_at`,
      [testData.tramite_id, testData.file_url, testData.file_type, testData.file_size]
    );
    
    console.log('\n✅ Inserción exitosa:');
    console.log(result.rows[0]);
    
    // Eliminar el registro de prueba
    await db.query('DELETE FROM tramite_adjuntos WHERE id = $1', [result.rows[0].id]);
    console.log('\n🧹 Registro de prueba eliminado');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error en la inserción:', error.message);
    console.error('Código:', error.code);
    console.error('Detalle:', error.detail);
    process.exit(1);
  }
}

testAdjuntoInsert();
