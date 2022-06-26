const path = require('node:path');

const loadJsonFromDir = require('./_utils/loadJsonFromDir');
const { pick, mapKeys } = require('./_utils/objectHelpers');

const shortKeysMap = {
  position: 'ps',
  points: 'pt',
  wins: 'w'
};

module.exports = {
  eleventyComputed: {
    pageData: async (opts) => {
      const { year } = opts;

      const {
        constructors: seasonConstructors = [],
        drivers: seasonDrivers = []
      } = await loadJsonFromDir(
        path.resolve(__dirname, `../data/seasons/${year}`)
      );

      const races = await loadJsonFromDir(
        path.resolve(__dirname, `../data/seasons/${year}/races`)
      );

      const racesArr = Object.values(races).sort((a, b) => a.round - b.round);

      const constructors = await loadJsonFromDir(
        path.resolve(__dirname, `../data/constructors`),
        seasonConstructors.map(({ constructorRef }) => constructorRef)
      );

      const drivers = await loadJsonFromDir(
        path.resolve(__dirname, `../data/drivers`),
        seasonDrivers.map(({ driverRef }) => driverRef)
      );

      const driversArr = Object.values(drivers);
      const constructorsArr = Object.values(constructors);

      const driversData = driversArr.map((d) => {
        return {
          label: d.name,
          data: racesArr.map((r) => {
            const result = r.driverStandings.find(
              (s) => s.driverRef === d.driverRef
            );

            return result
              ? mapKeys(
                  pick(result, ['position', 'points', 'wins']),
                  (key) => shortKeysMap[key]
                )
              : null;
          })
        };
      });

      const constructorsData = constructorsArr.map((c) => {
        return {
          label: c.name,
          data: racesArr.map((r) => {
            const result = r.constructorStandings.find(
              (s) => s.constructorRef === c.constructorRef
            );

            return result
              ? mapKeys(
                  pick(result, ['position', 'points', 'wins']),
                  (key) => shortKeysMap[key]
                )
              : null;
          })
        };
      });

      return {
        races: racesArr,
        drivers,
        constructors,
        raceNames: racesArr.map((race) => race.name),
        driversData,
        constructorsData
      };
    }
  }
};
