import mariadb from 'mariadb';

import { executeQueryFromFile, writeDataFile } from './helpers.mjs';
import { homePage } from './homepage.mjs';
import { seasons } from './seasons.mjs';

const db = await mariadb.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'f1db',
	bigIntAsNumber: true,
	dateStrings: true,
});

const seasonsData = await executeQueryFromFile(db, 'seasons.sql');

await writeDataFile(
	'seasons.yaml',
	seasonsData.map(({ year }) => year),
);
await homePage(db);
await seasons(db, seasonsData);

process.exit(0);
