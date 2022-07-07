const path = require('node:path');

module.exports = () => {
  const numOfEntities = require(path.resolve(
    process.cwd(),
    'data/entities-count.json'
  ));

  const racesByCountry = require(path.resolve(
    process.cwd(),
    'data/races-by-country.json'
  ));

  return {
    numOfEntities,
    racesByCountry: racesByCountry.reduce(
      (p, c) => ({ ...p, [c.country]: c.count }),
      {}
    )
  };
};
