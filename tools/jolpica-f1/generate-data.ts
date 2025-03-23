import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// import { Presets, SingleBar } from 'cli-progress';
import stringify from 'fast-json-stable-stringify';
// import meow from 'meow';
import prettier from 'prettier';

// import prompts from 'prompts';
import { getSeasonData } from './season-data';

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

const seasonData = await getSeasonData(season);

await writeDataFile(path.resolve(dataDir, `${season}.json`), seasonData);
