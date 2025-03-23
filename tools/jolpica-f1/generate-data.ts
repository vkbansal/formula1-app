import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { kebabCase } from 'change-case';
// import { Presets, SingleBar } from 'cli-progress';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import stringify from 'fast-json-stable-stringify';
// import meow from 'meow';
import prettier from 'prettier';

// import prompts from 'prompts';
import { getRacesData } from './data/races';

dayjs.extend(advancedFormat);

function slugify(str: string): string {
	return kebabCase(str)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const season = 2025;

const dataDir = path.resolve(__dirname, `../../src/content/seasons`);

const racesData = await getRacesData(season);

const rounds = racesData.map((race) => {
	return {
		circuit: {
			name: race.Circuit.circuitName,
			location: race.Circuit.Location.locality,
			country: race.Circuit.Location.country,
		},
		date: dayjs(race.date).format('Do MMM YYYY'),
		name: race.raceName,
		round: race.round,
		slug: slugify(race.raceName),
		driverStandings: [],
		constructorStandings: [],
		podium: [],
	};
});

await writeDataFile(path.resolve(dataDir, `${season}.json`), {
	rounds,
	teams: [],
	year: season,
});
