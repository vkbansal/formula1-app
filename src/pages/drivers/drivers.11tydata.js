const path = require('node:path');
const loadJsonFromDir = require('../../_utils/loadJsonFromDir');

module.exports = async () => {
  const drivers = await loadJsonFromDir(
    path.resolve(process.cwd(), `data/drivers`)
  );
  const data = Object.values(drivers);
  const mostRaceWins = data.reduce(
    (a, b) => (a.raceWins > b.raceWins ? a : b),
    data[0]
  );
  const mostTotalRaces = data.reduce(
    (a, b) => (a.totalRaces > b.totalRaces ? a : b),
    data[0]
  );

  return { drivers: data, mostRaceWins, mostTotalRaces };
};
