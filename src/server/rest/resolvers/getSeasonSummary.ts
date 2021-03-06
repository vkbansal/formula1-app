import type { Request, Response } from 'express';

import type { GetSeasonSummaryPathParams } from 'server/rest/types';
import resolvers from 'server/common/resolvers';

export async function getSeasonSummary(
  req: Request<GetSeasonSummaryPathParams>,
  res: Response
): Promise<unknown> {
  const { year } = req.params;

  const data = await resolvers.getSeasonSummary(year);

  return res.status(200).send(data);
}
