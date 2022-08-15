import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { dump } from 'js-yaml';
import mariadb from 'mariadb';

export class Datagen {
	constructor(spinner) {
		this.spinner = spinner;
	}

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
		const sql = await fsp.readFile(
			path.resolve(process.cwd(), 'datagen/queries', filepath),
			'utf8',
		);
		this.spinner.text = `executing query from ${filepath} with params => ${dump(params)}`;
		const data = await this.db.query(
			{ sql, namedPlaceholders: true, bigIntAsNumber: true },
			params,
		);

		return data;
	}

	async writeDataFile(filepath, data) {
		const finalPath = path.resolve(process.cwd(), 'src/data', filepath);
		await fsp.mkdir(path.dirname(finalPath), { recursive: true });
		return fsp.writeFile(
			finalPath,
			'# This file is auto-generated, please DO NOT MODIFY it directly\n' +
				dump(data, { noRefs: true }),
			'utf8',
		);
	}

	async homePage() {
		const [data] = await this.executeQueryFromFile('entities-count.sql');
		this.totalNumOfQueries += 1;

		return this.writeDataFile('homepage.yaml', data);
	}

	async seasons() {
		const data = await this.executeQueryFromFile('seasons.sql');

		for (const row of data) {
			const rounds = await this.executeQueryFromFile('season-rounds.sql', row);
			const drivers = await this.executeQueryFromFile('season-drivers.sql', row);
			const constructors = await this.executeQueryFromFile('season-constructors.sql', row);

			await this.writeDataFile(`seasons/${row.year}.yaml`, {
				...row,
				rounds,
				drivers,
				constructors,
			});
		}
	}

	async drivers() {
		const data = await this.executeQueryFromFile('drivers.sql');

		for (const row of data) {
			row.hasImage = fs.existsSync(`src/images/drivers/${row.driverRef}.webp`);

			const seasonData = await this.executeQueryFromFile('driver-seasons.sql', row);
			row.seasons = seasonData;

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
