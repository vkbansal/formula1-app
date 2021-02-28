import React from 'react';
import { createClient, Provider } from 'urql';
import { Redirect, Route } from 'react-router-dom';

import { SeasonSummaryPage } from './pages/SeasonSummaryPage/SeasonSummaryPage';

const client = createClient({
  url: '/api/graphql'
});

export default function GraphQLApp(): React.ReactElement {
  return (
    <Provider value={client}>
      <Route path="/graphql" exact>
        <Redirect to="/rest/seasons/2020/summary" />
      </Route>
      <Route path="/graphql/seasons/:year/summary" exact>
        <SeasonSummaryPage />
      </Route>
    </Provider>
  );
}
