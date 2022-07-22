import { executeQueryFromFile, writeDataFile } from './helpers.mjs';

export async function seasons(db, params = []) {
	for (const row of params) {
		const rounds = await executeQueryFromFile(db, 'season-rounds.sql', row);
		const drivers = await executeQueryFromFile(db, 'season-drivers.sql', row);
		const constructors = await executeQueryFromFile(db, 'season-constructors.sql', row);

		await writeDataFile(`seasons/${row.year}.yaml`, { rounds, drivers, constructors });
	}
}
