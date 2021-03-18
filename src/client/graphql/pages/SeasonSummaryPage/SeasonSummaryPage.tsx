import React from 'react';
import { useParams } from 'react-router-dom';

import { useSeasonSummaryPageQuery } from 'client/graphql/services';
import {
  SeasonSummaryPage as View,
  SeasonSummaryPageProps
} from 'client/common/pages/SeasonSummaryPage/SeasonSummaryPage';

export function SeasonSummaryPage(): React.ReactElement {
  const { year } = useParams<{ year: string }>();
  const [{ data }] = useSeasonSummaryPageQuery({ variables: { year } });

  const constructors = React.useMemo<
    SeasonSummaryPageProps['constructors']
  >(() => {
    if (!data) return [];

    return data.seasonSummary.constructors.map(
      ({ constructor, points, position }) => ({
        name: constructor.name,
        nationality: constructor.nationality,
        ref: constructor.ref,
        position,
        points
      })
    );
  }, [data]);

  const drivers = React.useMemo<SeasonSummaryPageProps['drivers']>(() => {
    if (!data) return [];

    return data.seasonSummary.drivers.map(({ driver, points, position }) => ({
      name: `${driver.forename} ${driver.surname}`,
      ref: driver.ref,
      nationality: driver.nationality,
      position,
      points
    }));
  }, [data]);

  const races = React.useMemo<SeasonSummaryPageProps['races']>(() => {
    if (!data) return [];

    return data.seasonSummary.races.map(
      ({ winner, polePosition, ...rest }) => ({
        ...rest,
        polePosition: polePosition
          ? {
              name: `${polePosition.forename} ${polePosition.surname}`,
              nationality: polePosition.nationality
            }
          : null,
        winner: winner
          ? {
              name: `${winner.forename} ${winner.surname}`,
              nationality: winner.nationality
            }
          : null
      })
    );
  }, [data]);

  return (
    <View
      module="graphql"
      year={year}
      constructors={constructors}
      drivers={drivers}
      races={races}
    />
  );
}
