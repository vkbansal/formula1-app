import fs from 'node:fs/promises';
import path from 'node:path';

import { dump } from 'js-yaml';
import mariadb from 'mariadb';

export class Datagen {
	async init() {
		this.db = await mariadb.createConnection({
			host: 'localhost',
			user: 'root',
			database: 'f1db',
			bigIntAsNumber: true,
			dateStrings: true,
		});
	}

	async executeQueryFromFile(filepath, params = {}) {
		const sql = await fs.readFile(path.resolve(process.cwd(), 'datagen/queries', filepath), 'utf8');
		console.log(`executing query from ${filepath} with params ${JSON.stringify(params)}`);
		const data = await this.db.query(
			{ sql, namedPlaceholders: true, bigIntAsNumber: true },
			params,
		);

		return data;
	}

	async writeDataFile(filepath, data) {
		const finalPath = path.resolve(process.cwd(), 'src/data', filepath);
		await fs.mkdir(path.dirname(finalPath), { recursive: true });
		return fs.writeFile(
			finalPath,
			'# This file is auto-generated, please DO NOT MODIFY it directly\n' +
				dump(data, { noRefs: true }),
			'utf8',
		);
	}

	async homePage() {
		const [data] = await this.executeQueryFromFile('entities-count.sql');

		return this.writeDataFile('homepage.yaml', data);
	}

	async seasons(params = []) {
		for (const row of params) {
			const rounds = await this.executeQueryFromFile('season-rounds.sql', row);
			const drivers = await this.executeQueryFromFile('season-drivers.sql', row);
			const constructors = await this.executeQueryFromFile('season-constructors.sql', row);

			await this.writeDataFile(`seasons/${row.year}.yaml`, { rounds, drivers, constructors });
		}
	}

	async drivers() {
		const data = await this.executeQueryFromFile('drivers.sql');

		for (const row of data) {
			await this.writeDataFile(`drivers/${row.driverRef}.yaml`, row);
		}
	}

	async constructors() {
		const data = await this.executeQueryFromFile('constructors.sql');

		for (const row of data) {
			await this.writeDataFile(`constructors/${row.constructorRef}.yaml`, row);
		}
	}
}
