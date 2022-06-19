const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const { getRandomColors } = require('./_utils/colors');

module.exports = {
  eleventyComputed: {
    pageData: async (opts) => {
      const { year } = opts;

      const file = path.resolve(process.cwd(), `datastore/season/${year}.yaml`);
      const contents = await fs.promises.readFile(file, 'utf8');
      const { races, drivers, constructors } = yaml.load(contents);
      const race_names = races.map((race) => race.name);
      const driver_colors = getRandomColors(drivers.length);
      const driver_standings = drivers.map((driver, i) => {
        const color = driver_colors[i];

        return {
          label: driver.name,
          backgroundColor: color,
          borderColor: color,
          data: races.map((race) => {
            const result = race.driver_standings.find(
              (standing) => standing.driverId === driver.driverId
            );

            return result ? result.position : null;
          })
        };
      });

      const driver_points = drivers.map((driver, i) => {
        const color = driver_colors[i];

        return {
          label: driver.name,
          backgroundColor: color,
          borderColor: color,
          data: races.map((race) => {
            const result = race.driver_standings.find(
              (standing) => standing.driverId === driver.driverId
            );

            return result ? result.points : null;
          })
        };
      });

      const constructor_colors = getRandomColors(constructors.length);
      const constructor_standings = constructors.map((constructor, i) => {
        const color = constructor_colors[i];

        return {
          label: constructor.name,
          backgroundColor: color,
          borderColor: color,
          data: races.map((race) => {
            const result = race.constructor_standings.find(
              (standing) => standing.constructorId === constructor.constructorId
            );

            return result ? result.position : null;
          })
        };
      });

      const constructor_points = constructors.map((constructor, i) => {
        const color = constructor_colors[i];

        return {
          label: constructor.name,
          backgroundColor: color,
          borderColor: color,
          data: races.map((race) => {
            const result = race.constructor_standings.find(
              (standing) => standing.constructorId === constructor.constructorId
            );

            return result ? result.points : null;
          })
        };
      });

      return {
        races,
        drivers,
        constructors,
        race_names,
        driver_standings,
        driver_points,
        constructor_standings,
        constructor_points
      };
    }
  }
};
