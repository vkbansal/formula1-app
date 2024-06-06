/* eslint-disable no-console */
/* global $ */
import 'zx/globals';

import * as cheerio from 'cheerio';

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import meow from 'meow';
import path from 'node:path';

const BASE_URL = 'http://ergast.com/downloads/';
const FILE_TO_DOWNLOAD = 'f1db_csv.zip';
const OUTPUT_FILE = `_data/${FILE_TO_DOWNLOAD}`;

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

const downloadsPage = await fetch(BASE_URL);
const downloadsPageText = await downloadsPage.text();
const $$ = cheerio.load(downloadsPageText);

const totalRows = $$('table > tbody > tr').length;
const csvRowIndex = Array.from({ length: totalRows }).findIndex((_, i) => {
	const text = $$(
		`table > tbody > tr:nth-child(${i}) > td:nth-child(2)`,
	).text();

	return text.trim() === FILE_TO_DOWNLOAD;
});

const lastModified = $$(
	`table > tbody > tr:nth-child(${csvRowIndex}) > td:nth-child(3)`,
)
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

const LINK_TO_DOWNLOAD = $$(
	`table > tbody > tr:nth-child(${csvRowIndex}) > td:nth-child(2) > a`,
).attr('href');
console.log('Downloading latest data');
await $`wget ${BASE_URL}/${LINK_TO_DOWNLOAD} -O ${OUTPUT_FILE}`;
await $`unzip -o ${OUTPUT_FILE} -d _data`;
await $`rm ${OUTPUT_FILE}`;

console.log('writing metadata');
await fs.promises.writeFile(VERSION_FILE, lastModified, 'utf8');
console.log('done!');
