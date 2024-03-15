import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import prompts from 'prompts';
import meow from 'meow';
import { SingleBar, Presets } from 'cli-progress';
import stringify from 'fast-json-stable-stringify';
import prettier from 'prettier';

import { DataGenerator, sluggify } from './DataGenerator';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** CLI INIT ******************************************************************/

const cli = meow('', {
	importMeta: import.meta,
	flags: {
		query: { type: 'string', isMultiple: true },
	},
});

const { query: queries = [], allQueries } = cli.flags;

/** Common Functions **********************************************************/
async function cleanDataDir(fileOrFolder: string): Promise<void> {
	return fs.rm(fileOrFolder, { recursive: true, force: true });
}

async function writeDataFile(filepath: string, data: unknown): Promise<void> {
	await fs.mkdir(path.dirname(filepath), { recursive: true });
	const formattedCode = await prettier.format(stringify(data), {
		printWidth: 80,
		useTabs: true,
		parser: 'json',
	});

	return fs.writeFile(filepath, formattedCode, 'utf8');
}

/** Query Functions ***********************************************************/
const bar = new SingleBar({}, Presets.shades_classic);

const dataGenerator = new DataGenerator();

const queryFns: Record<string, () => Promise<void>> = {
	async homepage() {
		return writeDataFile(
			path.resolve(__dirname, '../src/data/homepage.json'),
			dataGenerator.getHomePageData(),
		);
	},

	async seasons_list() {
		return writeDataFile(
			path.resolve(__dirname, '../src/data/seasons-list.json'),
			dataGenerator.getSeasonsList(),
		);
	},

	async seasons() {
		const data = dataGenerator.getSeasonsInstance().getData();
		const dataDir = path.resolve(__dirname, `../src/content/seasons`);

		bar.start(data.length, 0);

		let i = 0;

		await cleanDataDir(dataDir);

		for (const row of data) {
			bar.update(++i);
			await writeDataFile(
				path.resolve(dataDir, `${row.year}.json`),
				dataGenerator.getSeasonData(row.year),
			);
		}

		bar.stop();
	},
	async drivers(): Promise<void> {
		const data = dataGenerator.getDriversInstance().getData();
		const dataDir = path.resolve(__dirname, `../src/content/drivers`);

		bar.start(data.length, 0);

		let i = 0;

		await cleanDataDir(dataDir);

		for (const driver of data) {
			bar.update(++i);

			await writeDataFile(
				path.resolve(dataDir, `${driver.driverRef}.json`),
				dataGenerator.getDriverData(driver),
			);
		}

		bar.stop();
	},
	async constructors() {
		const data = dataGenerator.getConstructorsInstance().getData();
		const dataDir = path.resolve(__dirname, `../src/content/constructors`);

		bar.start(data.length, 0);
		let i = 0;

		await cleanDataDir(dataDir);

		for (const row of data) {
			bar.update(++i);

			await writeDataFile(
				path.resolve(dataDir, `${row.constructorRef}.json`),
				dataGenerator.getConstructorData(row),
			);
		}

		bar.stop();
	},
	async races() {
		const data = dataGenerator.getRacesInstance().getData();
		const dataDir = path.resolve(__dirname, `../src/content/rounds`);

		bar.start(data.length, 0);
		let i = 0;

		await cleanDataDir(dataDir);

		for (const race of data) {
			bar.update(++i);

			const slug = sluggify(race.name);

			await writeDataFile(
				path.resolve(dataDir, `${race.year}/${slug}.json`),
				dataGenerator.getRoundData(race, slug),
			);
		}

		bar.stop();
	},
};

/** CLI Logic *****************************************************************/
const LIST_QUERIES = Object.keys(queryFns);

if (queries.length === 0 && !allQueries) {
	const responses = await prompts([
		{
			name: 'query',
			type: 'multiselect',
			message: 'Please select all the queries you want to generate',
			choices: LIST_QUERIES.map((value) => ({ value, title: value })),
		},
	]);

	queries.splice(0, queries.length, ...responses.query);
} else if (allQueries) {
	queries.splice(0, queries.length, ...LIST_QUERIES);
}

if (queries.length === 0) {
	// eslint-disable-next-line no-console
	console.log('No query selceted. Exiting!');
	process.exit(0);
}

for (const query of queries) {
	try {
		// eslint-disable-next-line no-console
		console.log(`Executing ${query} query...`);
		await queryFns[query]?.();
	} catch (e) {
		// eslint-disable-next-line no-console
		console.log(e);
		process.exit(1);
	}
}

process.exit(0);
