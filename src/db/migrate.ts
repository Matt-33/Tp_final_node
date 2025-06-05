import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './index'; // Import pool directly

async function runMigration() {
  console.log('⏳ Lancement des migrations...');
  console.log(`Tentative de connexion à la base de données...`);
  
  try {
    // Test connection first
    const client = await pool.connect();
    console.log('✅ Connexion à la base de données établie');
    client.release();
    
    // Run migrations
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('✅ Migrations appliquées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
    console.log('\n👉 Vérifiez que:');
    console.log('  1. Votre serveur PostgreSQL est en cours d\'exécution');
    console.log('  2. Les informations de connexion dans le fichier .env sont correctes');
    console.log('  3. La base de données existe (créez-la manuellement si nécessaire)');
    process.exit(1);
  }
}

runMigration();
