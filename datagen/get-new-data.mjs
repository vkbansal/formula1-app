/* global $ */
import 'zx/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cwd = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const METADATA_FILE = path.resolve(cwd, 'metadata.json');
const metadata = JSON.parse(await fs.promises.readFile(METADATA_FILE, 'utf8'));

const lastestDBUpdatePage = await fetch('http://ergast.com/mrd/db/');
const lastestDBUpdateText = await lastestDBUpdatePage.text();
console.log('lastestDBUpdateText', lastestDBUpdateText);

const lastestUpdateTime = lastestDBUpdateText.match(
	/<p>The database images were last updated on: (.+)<\/p>/,
);

if (!lastestUpdateTime) {
	console.log('Could not find database update time!');
	process.exit(1);
}

const [, updateTime] = lastestUpdateTime;

if (!argv.includes('--force') && metadata.databaseLastUpdatedAt === updateTime) {
	console.log('No new data found!');
	process.exit(1);
}

console.log('New data exists');
console.log('Downloading latest data');
await $`wget http://ergast.com/downloads/f1db.sql.gz -O initdb.d/f1db.sql.gz`;

console.log('Stopping existing docker if running');
await $`docker compose down`;
await $`sleep 2`;

console.log('Staring docker');
await $`docker compose up -d`;
await $`while ! node datagen/index.mjs >/dev/null 2>&1; do
	echo "Trying datagen"
	sleep 2
done`;
console.log('Datagen done!');

console.log('Stopping docker');
await $`docker compose down`;

console.log('writing metadata');
const newContent = { databaseLastUpdatedAt: updateTime };
await fs.promises.writeFile(METADATA_FILE, JSON.stringify(newContent, null, 2), 'utf8');
console.log('done!');
