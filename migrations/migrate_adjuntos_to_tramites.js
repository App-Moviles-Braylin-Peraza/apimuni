const db = require('../db.js');

async function migrate() {
  try {
    console.log('=== Iniciando migración de adjuntos a tramites ===\n');
    
    // 1. Agregar columna adjuntos si no existe
    console.log('1. Agregando columna adjuntos a tramites...');
    await db.query(`
      ALTER TABLE tramites 
      ADD COLUMN IF NOT EXISTS adjuntos JSONB DEFAULT '[]'::jsonb
    `);
    console.log('   ✅ Columna agregada\n');
    
    // 2. Migrar datos existentes
    console.log('2. Migrando datos de tramite_adjuntos a tramites...');
    const adjuntosExistentes = await db.query(`
      SELECT tramite_id, 
             json_agg(
               json_build_object(
                 'id', id,
                 'file_url', file_url,
                 'file_type', file_type,
                 'file_size', file_size,
                 'uploaded_at', uploaded_at
               ) ORDER BY uploaded_at
             ) as adjuntos
      FROM tramite_adjuntos
      GROUP BY tramite_id
    `);
    
    console.log(`   Encontrados ${adjuntosExistentes.rows.length} trámites con adjuntos`);
    
    for (const row of adjuntosExistentes.rows) {
      await db.query(
        'UPDATE tramites SET adjuntos = $1 WHERE id = $2',
        [JSON.stringify(row.adjuntos), row.tramite_id]
      );
      console.log(`   ✅ Migrados adjuntos del trámite ${row.tramite_id}`);
    }
    
    console.log('\n3. Migración completada exitosamente!');
    console.log('\n⚠️  NOTA: La tabla tramite_adjuntos aún existe.');
    console.log('   Si deseas eliminarla, ejecuta:');
    console.log('   DROP TABLE tramite_adjuntos CASCADE;\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error en la migración:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

migrate();
