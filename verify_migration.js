const db = require('./db.js');

async function verificarMigracion() {
  try {
    console.log('=== Verificando migración ===\n');
    
    // Ver trámites con adjuntos
    const tramites = await db.query(`
      SELECT id, title, adjuntos 
      FROM tramites 
      WHERE adjuntos IS NOT NULL AND jsonb_array_length(adjuntos) > 0
      LIMIT 5
    `);
    
    console.log(`Trámites con adjuntos: ${tramites.rows.length}\n`);
    
    tramites.rows.forEach(t => {
      console.log(`ID: ${t.id}`);
      console.log(`Título: ${t.title}`);
      console.log('Adjuntos:', JSON.stringify(t.adjuntos, null, 2));
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verificarMigracion();
