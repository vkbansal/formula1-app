import { mariadbPool } from '../db';
import seasonSummaryQuery from '../queries/ConstructorsSeasonSummary.sql';
import driverSeasonSummaryQuery from '../queries/DriversSeasonSummary.sql';
import racesSummaryQuery from '../queries/RacesSummary.sql';

export async function getSeasonSummary(year: string): Promise<unknown> {
  const constructorsData: any[] = await mariadbPool.query(seasonSummaryQuery, [
    year,
    year
  ]);
  const driverData: any[] = await mariadbPool.query(driverSeasonSummaryQuery, [
    year,
    year
  ]);
  const racesData: any[] = await mariadbPool.query(
    {
      sql: racesSummaryQuery,
      dateStrings: true
    },
    [year]
  );

  return {
    constructors: constructorsData.map(({ constructor, ...rest }) => ({
      constructor: JSON.parse(constructor),
      ...rest
    })),
    drivers: driverData.map(({ driver, ...rest }) => ({
      driver: JSON.parse(driver),
      ...rest
    })),
    races: racesData.map(({ polePosition, winner, ...rest }) => ({
      ...rest,
      winner: JSON.parse(winner),
      polePosition: JSON.parse(polePosition)
    }))
  };
}
