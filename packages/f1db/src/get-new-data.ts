#!/usr/bin/env node
/* global $ */
import 'zx/globals';
import meow from 'meow';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = meow(``, {
	importMeta: import.meta,
	flags: {
		force: { type: 'boolean' },
	},
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const METADATA_FILE = path.resolve(__dirname, '../metadata.json');
const metadata = JSON.parse(await fs.promises.readFile(METADATA_FILE, 'utf8'));

const lastestDBUpdatePage = await fetch('http://ergast.com/mrd/db/');
const lastestDBUpdateText = await lastestDBUpdatePage.text();

const lastestUpdateTime = lastestDBUpdateText.match(
	/<p>The database images were last updated on: (.+)<\/p>/,
);

if (!lastestUpdateTime) {
	console.log('Could not find database update time!');
	process.exit(1);
}

const [, updateTime] = lastestUpdateTime;

if (!cli.flags.force && metadata.databaseLastUpdatedAt === updateTime) {
	console.log('No new data found!');
	process.exit(0);
}

console.log('New data exists');
console.log('Downloading latest data');
await $`wget http://ergast.com/downloads/f1db.sql.gz -O initdb.d/f1db.sql.gz`;

console.log('Stopping existing docker if running');
await $`docker compose down`;
await $`sleep 2`;

console.log('Staring docker');
await $`docker compose up -d`;

console.log('running datagen');
await $`while ! pnpm run datagen >/dev/null 2>&1; do
	echo "Trying datagen"
	sleep 2
done`;
console.log('Datagen done!');

console.log('Stopping docker');
await $`docker compose down`;

console.log('writing metadata');
const newContent = { databaseLastUpdatedAt: updateTime };
await fs.promises.writeFile(METADATA_FILE, JSON.stringify(newContent, null, '\t'), 'utf8');
console.log('done!');
