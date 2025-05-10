import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cacache from 'cacache';
import { kebabCase } from 'change-case';
import stringify from 'fast-json-stable-stringify';
import ogKy from 'ky';
import prettier from 'prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, `../../src/content`);
const CACHE_DIR = path.resolve(__dirname, '.cache');

export function slugify(str: string): string {
	return kebabCase(str)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

export const ky = ogKy.create({
	prefixUrl: 'https://api.jolpi.ca/ergast/f1/',
	hooks: {
		beforeRequest: [
			async (request) => {
				const cachedData = await cacache
					.get(CACHE_DIR, request.url)
					.catch(() => void 0);

				if (cachedData) {
					let data = cachedData.data.toString('utf8');

					// Add a flag to indicate that the data is from the cache
					data = `{"fromCache":true,${data.slice(1)}`;

					return new Response(data, {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					});
				}

				return;
			},
		],
		afterResponse: [
			async (request, _options, response) => {
				if (response.ok) {
					const data = await response.text();
					await cacache.put(CACHE_DIR, request.url, data);
				}
			},
		],
	},
});

export async function writeFileToDataDir(
	filepath: string,
	data: unknown,
): Promise<void> {
	const fullPath = path.resolve(DATA_DIR, filepath);
	await fs.mkdir(path.dirname(fullPath), { recursive: true });
	const formattedCode = await prettier.format(stringify(data), {
		printWidth: 80,
		useTabs: true,
		parser: 'json',
	});

	return fs.writeFile(fullPath, formattedCode, 'utf8');
}
