import type { Request, Response } from 'express';
import { mariadbPool } from 'server/common/db';
import seasonSummaryQuery from 'server/common/queries/ConstructorsSeasonSummary.sql';
import driverSeasonSummaryQuery from 'server/common/queries/DriversSeasonSummary.sql';
import racesSummaryQuery from 'server/common/queries/RacesSummary.sql';
import type { GetSeasonSummaryPathParams } from 'server/rest/types';

export async function getSeasonSummary(
  req: Request<GetSeasonSummaryPathParams>,
  res: Response
): Promise<unknown> {
  const { year } = req.params;

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

  return res.status(200).send({
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
  });
}
