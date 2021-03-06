import type { Request, Response } from 'express';

import type { GetConstructorStandingsPathParams } from 'server/rest/types';
import resolvers from 'server/common/resolvers';

export async function getConstructorStandings(
  req: Request<GetConstructorStandingsPathParams>,
  res: Response
): Promise<unknown> {
  const { constructorRef, year } = req.params;

  const data = await resolvers.getConstructorStandings(constructorRef, year);

  return res.status(200).send(data);
}
