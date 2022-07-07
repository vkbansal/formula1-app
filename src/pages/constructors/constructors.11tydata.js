const path = require('node:path');
const loadJsonFromDir = require('../../_utils/loadJsonFromDir');

module.exports = async () => {
	const constructors = await loadJsonFromDir(
		path.resolve(process.cwd(), `data/constructors`)
	);

	const data = Object.values(constructors).map((d) => ({
		...d,
		championshipWins: d.championshipStandings.filter((c) => c.position === 1)
			.length
	}));

	return { constructors: data };
};
