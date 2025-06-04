import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './index';

async function runMigration() {
  console.log('⏳ Lancement des migrations...');
  
  try {
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('✅ Migrations appliquées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
    process.exit(1);
  }
}

runMigration();
