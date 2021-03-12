import React from 'react';
import { createClient, Provider } from 'urql';
import { Redirect, Route } from 'react-router-dom';

import { SeasonSummaryPage } from './pages/SeasonSummaryPage/SeasonSummaryPage';
import { ConstructorStandingsPage } from './pages/ConstructorStandingsPage/ConstructorStandingsPage';
import { DriverStandingsPage } from './pages/DriverStandingsPage/DriverStandingsPage';

const client = createClient({
  url: '/api/graphql'
});

export default function GraphQLApp(): React.ReactElement {
  return (
    <Provider value={client}>
      <Route path="/graphql" exact>
        <Redirect to="/graphql/seasons/2020/summary" />
      </Route>
      <Route path="/graphql/seasons/:year/summary" exact>
        <SeasonSummaryPage />
      </Route>
      <Route
        path="/graphql/seasons/:year/constructors/:constructorRef/standings"
        exact
      >
        <ConstructorStandingsPage />
      </Route>
      <Route path="/graphql/seasons/:year/drivers/:driverRef/standings" exact>
        <DriverStandingsPage />
      </Route>
    </Provider>
  );
}
