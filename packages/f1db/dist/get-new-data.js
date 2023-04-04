#!/usr/bin/env node
/* eslint-disable no-console */
/* global $ */
import 'zx/globals';
import meow from 'meow';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cheerio from 'cheerio';
const cli = meow(``, {
    importMeta: import.meta,
    flags: {
        force: { type: 'boolean' },
        datagen: { type: 'boolean' },
    },
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERSION_FILE = path.resolve(__dirname, '../.f1db-version');
const version = await fs.promises.readFile(VERSION_FILE, 'utf8');
const downloadsPage = await fetch('http://ergast.com/downloads/');
const downloadsPageText = await downloadsPage.text();
const $$ = cheerio.load(downloadsPageText);
const totalRows = $$('table > tbody > tr').length;
const csvRowIndex = Array.from({ length: totalRows }).findIndex((_, i) => {
    const text = $$(`table > tbody > tr:nth-child(${i}) > td:nth-child(2)`).text();
    return text.trim() === 'f1db.sql.gz';
});
const lastModified = $$(`table > tbody > tr:nth-child(${csvRowIndex}) > td:nth-child(3)`)
    .text()
    .trim();
if (!lastModified) {
    console.log('Could not find database update time!');
    process.exit(1);
}
if (!cli.flags.force && version === lastModified) {
    console.log('No new data found!');
    process.exit(0);
}
console.log('New data exists');
console.log('Downloading latest data');
await $ `wget http://ergast.com/downloads/f1db.sql.gz -O initdb.d/f1db.sql.gz`;
console.log('writing metadata');
await fs.promises.writeFile(VERSION_FILE, lastModified, 'utf8');
console.log('done!');
if (cli.flags.datagen) {
    console.log('Stopping existing docker if running');
    await $ `docker compose down`;
    await $ `sleep 2`;
    console.log('Staring docker');
    await $ `docker compose up -d`;
    console.log('running datagen');
    await $ `while ! pnpm run datagen >/dev/null 2>&1; do
		echo "Trying datagen"
		sleep 2
	done`;
    console.log('Datagen done!');
    console.log('Stopping docker');
    await $ `docker compose down`;
}
