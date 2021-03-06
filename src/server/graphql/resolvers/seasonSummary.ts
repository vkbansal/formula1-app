import type { QuerySeasonSummaryArgs } from 'server/graphql/types';
import resolvers from 'server/common/resolvers';

export async function seasonSummary(
  args: QuerySeasonSummaryArgs
): Promise<unknown> {
  const { year } = args;

  return resolvers.getSeasonSummary(year);
}
