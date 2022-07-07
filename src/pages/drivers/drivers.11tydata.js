const path = require('node:path');
const loadJsonFromDir = require('../../_utils/loadJsonFromDir');
const metadata = require('../../_data/metadata.json');

module.exports = async () => {
	const drivers = await loadJsonFromDir(
		path.resolve(process.cwd(), `data/drivers`)
	);
	const currentDrivers = require(path.resolve(
		process.cwd(),
		`data/seasons/${metadata.currentSeason}/drivers.json`
	)).map((d) => d.driverRef);

	const data = Object.values(drivers).map((d) => ({
		...d,
		championshipWins: d.championshipStandings.filter((c) => c.position === 1)
			.length
	}));
	const mostRaceWins = data.reduce(
		(a, b) => (a.raceWins > b.raceWins ? a : b),
		data[0]
	);
	const mostTotalRaces = data.reduce(
		(a, b) => (a.totalRaces > b.totalRaces ? a : b),
		data[0]
	);

	return { drivers: data, currentDrivers, mostRaceWins, mostTotalRaces };
};
