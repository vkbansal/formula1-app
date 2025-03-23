import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cacache from 'cacache';
import { kebabCase } from 'change-case';
import ogKy from 'ky';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
				const data = await response.text();
				await cacache.put(CACHE_DIR, request.url, data);
			},
		],
	},
});

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
