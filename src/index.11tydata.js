module.exports = () => {
  const numOfEntities = require('../data/entities-count.json');

  const racesByCountry = require('../data/races-by-country.json');

  return {
    numOfEntities,
    racesByCountry: racesByCountry.reduce(
      (p, c) => ({ ...p, [c.country]: c.count }),
      {}
    )
  };
};
