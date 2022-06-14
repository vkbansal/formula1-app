import type { ChartDataSets } from 'chart.js';
import seasonsDataQuery, {
  type SeasonData as SeasonsQueryData
} from 'queries/seasonData';
import { getRandomColors } from 'utils/colors';

export interface SeasonData extends SeasonsQueryData {
  race_names: string[];
  driver_standings: ChartDataSets[];
  driver_points: ChartDataSets[];
  constructor_standings: ChartDataSets[];
  constructor_points: ChartDataSets[];
}

export default async function seasonData(year: string): Promise<SeasonData> {
  const { races, drivers, constructors } = await seasonsDataQuery(year);

  const race_names = races.map((race) => race.name);
  const driver_colors = getRandomColors(drivers.length);
  const driver_standings: ChartDataSets[] = drivers.map((driver, i) => {
    const color = driver_colors[i];

    return {
      label: `${driver.forename} ${driver.surname}`,
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

  const driver_points: ChartDataSets[] = drivers.map((driver, i) => {
    const color = driver_colors[i];

    return {
      label: `${driver.forename} ${driver.surname}`,
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
  const constructor_standings: ChartDataSets[] = constructors.map(
    (constructor, i) => {
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
    }
  );

  const constructor_points: ChartDataSets[] = constructors.map(
    (constructor, i) => {
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
    }
  );

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
