const db = require('./db.js');

async function checkDB() {
  try {
    // Verificar estructura de tramite_adjuntos
    const structure = await db.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'tramite_adjuntos' 
      ORDER BY ordinal_position
    `);
    
    console.log('=== Estructura de tramite_adjuntos ===');
    structure.rows.forEach(row => {
      const maxLen = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
      const nullable = row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL';
      console.log(`  ${row.column_name}: ${row.data_type}${maxLen} ${nullable}`);
    });
    
    // Verificar si hay datos
    const count = await db.query('SELECT COUNT(*) as total FROM tramite_adjuntos');
    console.log(`\n=== Registros en tramite_adjuntos: ${count.rows[0].total} ===`);
    
    // Mostrar últimos registros
    const recent = await db.query('SELECT * FROM tramite_adjuntos ORDER BY uploaded_at DESC LIMIT 5');
    if (recent.rows.length > 0) {
      console.log('\n=== Últimos registros ===');
      recent.rows.forEach((row, i) => {
        console.log(`${i + 1}. ID: ${row.id}, Tramite: ${row.tramite_id}, URL: ${row.file_url ? row.file_url.substring(0, 50) + '...' : 'NULL'}`);
      });
    } else {
      console.log('\n⚠️  No hay registros en la tabla');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDB();
