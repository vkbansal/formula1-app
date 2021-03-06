import { mariadbPool } from 'server/common/db';
import type { QuerySeasonSummaryArgs } from './types';
import constructorsSeasonSummaryQuery from 'server/common/queries/ConstructorsSeasonSummary.sql';
import driverSeasonSummaryQuery from 'server/common/queries/DriversSeasonSummary.sql';
import racesSummaryQuery from 'server/common/queries/RacesSummary.sql';

export async function seasonSummary(args: QuerySeasonSummaryArgs) {
  const { year } = args;
  const constructorsData: any[] = await mariadbPool.query(
    constructorsSeasonSummaryQuery,
    [year, year]
  );
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
