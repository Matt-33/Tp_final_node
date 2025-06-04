import { testDatabaseConnection } from './index';

async function runTestConnection() {
  try {
	await testDatabaseConnection();
	console.log('✅ Test de connexion réussi !');
  } catch (error) {
	console.error('❌ Test de connexion échoué :', error);
  }
}

runTestConnection()