import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { snakeCase } from 'change-case';
import { parse } from 'papaparse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../_data');

export abstract class BaseData<T = unknown> {
	protected filename: string = '';

	protected data: ReadonlyArray<T> = [];

	protected loadData(): void {
		if (!this.filename) {
			throw new Error('filename not set');
		}

		this.data = Object.freeze(this.parseFile(this.filename));
	}

	public getData(): ReadonlyArray<T> {
		return this.data;
	}

	protected parseFile(name: string): ReadonlyArray<T> {
		const file = readFileSync(path.resolve(DATA_DIR, name), 'utf-8');
		const { data } = parse<T>(file.trim(), {
			header: true,
			dynamicTyping: true,
			transform(value, field) {
				if (field === 'constructorRef' || field === 'driverRef') {
					return snakeCase(value);
				}

				if (value === '\\N') {
					return null;
				}

				return value;
			},
		});

		return data;
	}
}
