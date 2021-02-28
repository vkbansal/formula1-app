export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
