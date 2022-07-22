import { executeQueryFromFile, writeDataFile } from './helpers.mjs';

export async function homePage(db) {
	const [data] = await executeQueryFromFile(db, 'entities-count.sql');

	return writeDataFile('homepage.yaml', data);
}
