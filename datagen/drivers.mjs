import { executeQueryFromFile, writeDataFile } from './helpers.mjs';

export async function drivers(db) {
	const data = await executeQueryFromFile(db, 'drivers.sql');

	return writeDataFile('drivers.yaml', data);
}
