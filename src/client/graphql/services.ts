import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  seasonSummary: SeasonSummary;
};

export type QuerySeasonSummaryArgs = {
  year: Scalars['String'];
};

export type SeasonSummary = {
  __typename?: 'SeasonSummary';
  constructors: Array<ConstructorSeasonSummary>;
  drivers: Array<DriverSeasonSummary>;
  races: Array<RaceSummary>;
};

export type ConstructorSeasonSummary = {
  __typename?: 'ConstructorSeasonSummary';
  constructor: Constructor;
  points: Scalars['Int'];
  position: Scalars['Int'];
};

export type Constructor = {
  __typename?: 'Constructor';
  id: Scalars['Int'];
  ref: Scalars['String'];
  name: Scalars['String'];
  nationality: Scalars['String'];
  url: Scalars['String'];
};

export type DriverSeasonSummary = {
  __typename?: 'DriverSeasonSummary';
  driver: Driver;
  points: Scalars['Int'];
  position: Scalars['Int'];
};

export type Driver = {
  __typename?: 'Driver';
  id: Scalars['Int'];
  ref: Scalars['String'];
  forename: Scalars['String'];
  surname: Scalars['String'];
  nationality: Scalars['String'];
  url: Scalars['String'];
};

export type RaceSummary = {
  __typename?: 'RaceSummary';
  round: Scalars['Int'];
  date: Scalars['String'];
  name: Scalars['String'];
  polePosition: Driver;
  winner: Driver;
};

export type SeasonSummaryQueryVariables = Exact<{
  year: Scalars['String'];
}>;

export type SeasonSummaryQuery = { __typename?: 'Query' } & {
  seasonSummary: { __typename?: 'SeasonSummary' } & {
    constructors: Array<
      { __typename?: 'ConstructorSeasonSummary' } & Pick<
        ConstructorSeasonSummary,
        'points' | 'position'
      > & {
          constructor: { __typename?: 'Constructor' } & Pick<
            Constructor,
            'name' | 'nationality'
          >;
        }
    >;
    drivers: Array<
      { __typename?: 'DriverSeasonSummary' } & Pick<
        DriverSeasonSummary,
        'points' | 'position'
      > & {
          driver: { __typename?: 'Driver' } & Pick<
            Driver,
            'forename' | 'surname' | 'nationality'
          >;
        }
    >;
    races: Array<
      { __typename?: 'RaceSummary' } & Pick<
        RaceSummary,
        'round' | 'name' | 'date'
      > & {
          polePosition: { __typename?: 'Driver' } & Pick<
            Driver,
            'forename' | 'surname' | 'nationality'
          >;
          winner: { __typename?: 'Driver' } & Pick<
            Driver,
            'forename' | 'surname' | 'nationality'
          >;
        }
    >;
  };
};

export const SeasonSummaryDocument = gql`
  query SeasonSummary($year: String!) {
    seasonSummary(year: $year) {
      constructors {
        constructor {
          name
          nationality
        }
        points
        position
      }
      drivers {
        driver {
          forename
          surname
          nationality
        }
        points
        position
      }
      races {
        round
        name
        date
        polePosition {
          forename
          surname
          nationality
        }
        winner {
          forename
          surname
          nationality
        }
      }
    }
  }
`;

export function useSeasonSummaryQuery(
  options: Omit<Urql.UseQueryArgs<SeasonSummaryQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<SeasonSummaryQuery>({
    query: SeasonSummaryDocument,
    ...options
  });
}
