import { executeQueryFromFile, writeDataFile } from './helpers.mjs';

export async function seasons(db, params = []) {
	for (const row of params) {
		const racesData = await executeQueryFromFile(db, 'season-rounds.sql', row);
		const drivers = await executeQueryFromFile(db, 'season-drivers.sql', row);
		const constructors = await executeQueryFromFile(db, 'season-drivers.sql', row);

		const rounds = racesData.map(({ winnerConstructor, winnerDriver, ...rest }) => {
			return {
				...rest,
				winner: {
					driver: winnerDriver
						? drivers.find((driver) => driver.driverRef === winnerDriver) || null
						: null,
				},
			};
		});

		await writeDataFile(`season/${row.year}.yaml`, { rounds, drivers, constructors });
	}
}
