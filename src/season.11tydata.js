const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

module.exports = {
  eleventyComputed: {
    pageData: async (opts) => {
      const { year } = opts;

      const file = path.resolve(process.cwd(), `datastore/season/${year}.yaml`);
      const contents = await fs.promises.readFile(file, 'utf8');
      const { races, drivers, constructors } = yaml.load(contents);
      const race_names = races.map((race) => race.name);
      const driver_standings = drivers.map((driver) => {
        return {
          label: driver.name,
          data: races.map((race) => {
            const result = race.driver_standings.find(
              (standing) => standing.driverId === driver.driverId
            );

            return result ? result.position : null;
          })
        };
      });

      const driver_points = drivers.map((driver) => {
        return {
          label: driver.name,
          data: races.map((race) => {
            const result = race.driver_standings.find(
              (standing) => standing.driverId === driver.driverId
            );

            return result ? result.points : null;
          })
        };
      });

      const constructor_standings = constructors.map((constructor) => {
        return {
          label: constructor.name,
          data: races.map((race) => {
            const result = race.constructor_standings.find(
              (standing) => standing.constructorId === constructor.constructorId
            );

            return result ? result.position : null;
          })
        };
      });

      const constructor_points = constructors.map((constructor) => {
        return {
          label: constructor.name,
          data: races.map((race) => {
            const result = race.constructor_standings.find(
              (standing) => standing.constructorId === constructor.constructorId
            );

            return result ? result.points : null;
          })
        };
      });

      const drivers_index_map = drivers.reduce(
        (map, driver, i) => ({ ...map, [driver.driverId]: i }),
        {}
      );

      const constructors_index_map = constructors.reduce(
        (map, constructor, i) => ({ ...map, [constructor.constructorId]: i }),
        {}
      );

      return {
        races,
        drivers,
        drivers_index_map,
        constructors,
        constructors_index_map,
        race_names,
        driver_standings,
        driver_points,
        constructor_standings,
        constructor_points
      };
    }
  }
};
