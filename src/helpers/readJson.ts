import path from 'node:path';
import fs from 'node:fs';

import { globby } from 'globby';

export async function readJson<T = unknown>(filepath: string): Promise<T> {
	const text = await fs.promises.readFile(filepath, 'utf8');

	return JSON.parse(text) as T;
}

export async function loadJsonFromDir<T = unknown, U = string>(
	folder: string,
	pick: string[] = []
): Promise<U extends string ? Record<U, T> : T> {
	const files =
		pick.length > 0
			? pick.map((file) => `${folder}/${file}.json`)
			: await globby([`${folder}/*.json`]);

	const data = {};

	for (const file of files) {
		const key = path.basename(file).replace(path.extname(file), '');
		const value = await readJson(file);

		data[key] = value;
	}

	return data as any;
}
