import React from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';

import { ConstructorStandingsPage as View } from 'client/common/pages/ConstructorStandingsPage/ConstructorStandingsPage';
import { useConstructorStandingsPageQuery } from 'client/graphql/services';

export function ConstructorStandingsPage(): React.ReactElement {
  const { constructorRef, year } = useParams<{
    constructorRef: string;
    year: string;
  }>();
  const [{ data, fetching }] = useConstructorStandingsPageQuery({
    variables: {
      ref: constructorRef,
      year
    }
  });

  return data && !fetching ? (
    <View
      module="graphql"
      name={data.constructorStandings.name}
      nationality={data.constructorStandings.nationality}
      year={year}
      races={data.constructorStandings.standings || []}
    />
  ) : (
    <Spinner size="xl" />
  );
}
