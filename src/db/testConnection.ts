import { testDatabaseConnection } from './index';
import Logger from "../utils/logger";

async function runTestConnection() {
  try {
	await testDatabaseConnection();
	Logger.info('✅ Test de connexion réussi !');
  } catch (error) {
	Logger.error('❌ Test de connexion échoué :', { error });
  }
}

runTestConnection()