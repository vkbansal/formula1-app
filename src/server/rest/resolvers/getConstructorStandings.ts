import type { Request, Response } from 'express';
import { mariadbPool } from 'server/common/db';

import type { GetConstructorStandingsPathParams } from 'server/rest/types';
import constructorQuery from 'server/common/queries/Constructor.sql';
import constructorStandingsQuery from 'server/common/queries/ConstructorStandings.sql';

export async function getConstructorStandings(
  req: Request<GetConstructorStandingsPathParams>,
  res: Response
): Promise<unknown> {
  const { constructorRef, year } = req.params;

  const [constructorData] = await mariadbPool.query(constructorQuery, [
    constructorRef
  ]);

  const standingsData = await mariadbPool.query(
    { sql: constructorStandingsQuery, dateStrings: true },
    [constructorRef, year]
  );

  return res.status(200).send({
    ...constructorData,
    standings: standingsData
  });
}
