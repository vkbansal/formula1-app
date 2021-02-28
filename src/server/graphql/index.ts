import { Router } from 'express';
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { mariadbPool } from 'server/common/db';
import type { QuerySeasonSummaryArgs } from './types';
import constructorsSeasonSummaryQuery from 'server/common/queries/ConstructorsSeasonSummary.sql';
import driverSeasonSummaryQuery from 'server/common/queries/DriversSeasonSummary.sql';
import racesSummaryQuery from 'server/common/queries/RacesSummary.sql';
import gqlSchema from './schema.gql';

const schema = buildSchema(gqlSchema);
const router = Router();

const resolvers = {
  async seasonSummary(args: QuerySeasonSummaryArgs) {
    const { year } = args;
    const constructorsData: any[] = await mariadbPool.query(
      constructorsSeasonSummaryQuery,
      [year, year]
    );
    const driverData: any[] = await mariadbPool.query(
      driverSeasonSummaryQuery,
      [year, year]
    );
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
};

router.use(
  '/',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

export default router;
