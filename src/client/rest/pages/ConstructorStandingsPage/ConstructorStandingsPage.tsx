import React from 'react';
import { useParams } from 'react-router';
import { Spinner } from '@chakra-ui/spinner';

import { ConstructorStandingsPage as View } from 'client/common/pages/ConstructorStandingsPage/ConstructorStandingsPage';
import { useGetConstructorStandings } from 'client/rest/services';

export function ConstructorStandingsPage(): React.ReactElement {
  const { constructorRef, year } = useParams<{
    constructorRef: string;
    year: string;
  }>();
  const { data, loading } = useGetConstructorStandings({
    constructorRef,
    year
  });

  return data && !loading ? (
    <View
      module="rest"
      name={data.name}
      nationality={data.nationality}
      year={year}
      races={data.standings || []}
    />
  ) : (
    <Spinner />
  );
}
