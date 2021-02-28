import React from 'react';
import { useParams } from 'react-router-dom';

import { useSeasonSummary } from 'client/rest/services';
import {
  SeasonSummaryPage as View,
  SeasonSummaryPageProps
} from 'client/common/pages/SeasonSummaryPage/SeasonSummaryPage';

export function SeasonSummaryPage(): React.ReactElement {
  const { year } = useParams<{ year: string }>();
  const { data } = useSeasonSummary({ year });

  const constructors = React.useMemo<
    SeasonSummaryPageProps['constructors']
  >(() => {
    if (!data) return [];

    return data.constructors.map(({ constructor, points, position }) => ({
      name: constructor.name,
      nationality: constructor.nationality,
      position,
      points
    }));
  }, [data]);

  const drivers = React.useMemo<SeasonSummaryPageProps['drivers']>(() => {
    if (!data) return [];

    return data.drivers.map(({ driver, points, position }) => ({
      name: `${driver.forename} ${driver.surname}`,
      nationality: driver.nationality,
      position,
      points
    }));
  }, [data]);

  const races = React.useMemo<SeasonSummaryPageProps['races']>(() => {
    if (!data) return [];

    return data.races.map(({ winner, polePosition, ...rest }) => ({
      ...rest,
      polePosition: {
        name: `${polePosition.forename} ${polePosition.surname}`,
        nationality: polePosition.nationality
      },
      winner: {
        name: `${winner.forename} ${winner.surname}`,
        nationality: winner.nationality
      }
    }));
  }, [data]);

  return (
    <View
      year={year}
      constructors={constructors}
      drivers={drivers}
      races={races}
    />
  );
}
