import { Router } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import { mariadbPool } from 'server/common/db';
import seasonSummaryQuery from 'server/common/queries/ConstructorsSeasonSummary.sql';
import driverSeasonSummaryQuery from 'server/common/queries/DriversSeasonSummary.sql';
import racesSummaryQuery from 'server/common/queries/RacesSummary.sql';
import spec from './openapi.yaml';

const router = Router();

router.use(
  OpenApiValidator.middleware({
    apiSpec: spec as any,
    validateApiSpec: true,
    validateRequests: true,
    validateResponses: true
  })
);

router.get('/seasons/:year/summary', async (req, res) => {
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

  res.status(200).send({
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
});

export default router;
