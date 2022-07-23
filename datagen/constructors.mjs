import { executeQueryFromFile, writeDataFile } from './helpers.mjs';

export async function constructors(db) {
	const data = await executeQueryFromFile(db, 'constructors.sql');

	return writeDataFile('constructors.yaml', data);
}
