import fs from 'node:fs/promises';
import path from 'node:path';
import { dump } from 'js-yaml';

export async function executeQueryFromFile(db, filepath, params = {}) {
	const sql = await fs.readFile(path.resolve(process.cwd(), 'datagen/queries', filepath), 'utf8');
	console.log(`executing query from ${filepath} with params ${JSON.stringify(params)}`);
	const data = await db.query({ sql, namedPlaceholders: true, bigIntAsNumber: true }, params);

	return data;
}

// export async function executeQueryFromFileWithListOfParams(db, filepath, params = []) {
// 	const sql = await fs.readFile(path.resolve(process.cwd(), 'datagen/queries', filepath), 'utf8');
// 	const data = [];

// 	for (const row of params) {
// 		console.log(`executing query from ${filepath} with params ${JSON.stringify(row)}`);
// 		const rowData = await db.query({ sql, namedPlaceholders: true, bigIntAsNumber: true }, params);

// 		data.push({ data: rowData, params: row });
// 	}

// 	return data;
// }

export async function writeDataFile(filepath, data) {
	const finalPath = path.resolve(process.cwd(), 'src/data', filepath);
	await fs.mkdir(path.dirname(finalPath), { recursive: true });
	return fs.writeFile(
		finalPath,
		'# This file is auto-generated, please DO NOT MODIFY it directly\n' +
			dump(data, { noRefs: true }),
		'utf8',
	);
}
