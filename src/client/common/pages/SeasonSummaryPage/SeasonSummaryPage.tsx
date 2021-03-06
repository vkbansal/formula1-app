import React from 'react';
import {
  Container,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Select
} from '@chakra-ui/react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import emojiFlags from 'emoji-flags';
import { css } from '@emotion/css';

const LIMIT = 2020;
const START = 1950;

export interface SeasonSummaryPageProps {
  module: 'rest' | 'graphql';
  constructors: Array<{
    name: string;
    nationality: string;
    position: number;
    points: number;
    ref: string;
  }>;
  drivers: Array<{
    name: string;
    nationality: string;
    position: number;
    points: number;
    ref: string;
  }>;
  races: Array<{
    round: number;
    name: string;
    date: string;
    polePosition: {
      name: string;
      nationality: string;
    };
    winner: {
      name: string;
      nationality: string;
    };
  }>;
  year: string;
}

const tabIds = ['constructor-standings', 'driver-standings', 'races'];

const tableStyles = css`
  & > tbody > tr > td > a {
    display: block;
    padding: 1rem 1.5rem;
  }

  & > tbody > tr:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

export function SeasonSummaryPage(
  props: SeasonSummaryPageProps
): React.ReactElement {
  const { year, constructors, drivers, races, module } = props;
  const [tabIndex, setTabIndex] = React.useState(0);
  const history = useHistory();
  const location = useLocation();

  const handleTabsChange = (index: number): void => {
    history.replace(`${location.pathname}#${tabIds[index]}`);
  };

  React.useEffect(() => {
    setTabIndex(Math.max(0, tabIds.indexOf(location.hash.replace(/^#/, ''))));
  }, [location.hash]);

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    history.push(`/${module}/seasons/${e.target.value}/summary`);
  }

  function getConstructorLink(ref: string): string {
    return `/${module}/seasons/${year}/constructors/${ref}/standings`;
  }

  function getDriverLink(ref: string): string {
    return `/${module}/seasons/${year}/drivers/${ref}/standings`;
  }

  return (
    <Container paddingBlockStart="4">
      <Text
        as="div"
        fontSize="lg"
        fontWeight="bold"
        textAlign="center"
        marginBlockEnd="4"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text as="span" whiteSpace="nowrap" marginInlineEnd="2">
          Summary for Season
        </Text>
        <Select
          display="inline"
          width="auto"
          fontWeight="bold"
          value={year}
          onChange={handleYearChange}
        >
          {Array.from({ length: LIMIT - START }, (_, i) => {
            return (
              <option key={LIMIT - i} value={LIMIT - i}>
                {LIMIT - i}
              </option>
            );
          })}
        </Select>
      </Text>
      <Tabs isFitted index={tabIndex} onChange={handleTabsChange}>
        <TabList>
          <Tab>Constructor Standings</Tab>
          <Tab>Driver Standings</Tab>
          <Tab>Races</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table key={year} className={tableStyles}>
              <Thead>
                <Tr>
                  <Th>Position</Th>
                  <Th>Name</Th>
                  <Th>Points</Th>
                </Tr>
              </Thead>
              <Tbody>
                {constructors.map(
                  ({ name, points, position, nationality, ref }, i) => (
                    <Tr key={i}>
                      <Td padding="0">
                        <Link to={getConstructorLink(ref)}>{position}</Link>
                      </Td>
                      <Td padding="0">
                        <Link to={getConstructorLink(ref)}>
                          <Text as="span" marginInlineEnd="2">
                            {name}
                          </Text>
                          <Text as="span" fontSize="xl">
                            {emojiFlags[nationality]?.emoji}
                          </Text>
                        </Link>
                      </Td>
                      <Td padding="0">
                        <Link to={getConstructorLink(ref)}>{points}</Link>
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>
            <Table key={year} className={tableStyles}>
              <Thead>
                <Tr>
                  <Th>Position</Th>
                  <Th>Name</Th>
                  <Th>Points</Th>
                </Tr>
              </Thead>
              <Tbody>
                {drivers.map(
                  ({ name, points, position, nationality, ref }, i) => (
                    <Tr key={i}>
                      <Td padding="0">
                        <Link to={getDriverLink(ref)}>{position}</Link>
                      </Td>
                      <Td padding="0">
                        <Link to={getDriverLink(ref)}>
                          <Text as="span" marginInlineEnd="2">
                            {name}
                          </Text>
                          <Text as="span" fontSize="xl">
                            {emojiFlags[nationality]?.emoji}
                          </Text>
                        </Link>
                      </Td>
                      <Td padding="0">
                        <Link to={getDriverLink(ref)}>{points}</Link>
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>
            <Table key={year}>
              <Thead>
                <Tr>
                  <Th>Round</Th>
                  <Th>Track</Th>
                  <Th>Date</Th>
                  <Th>Pole Position</Th>
                  <Th>Winnner</Th>
                </Tr>
              </Thead>

              <Tbody>
                {races.map((row, i) => (
                  <Tr key={i}>
                    <Td>{row.round}</Td>
                    <Td>{row.name}</Td>
                    <Td>{row.date}</Td>
                    <Td>
                      <Text as="span" marginInlineEnd="2">
                        {row.polePosition.name}
                      </Text>
                      <Text as="span" fontSize="xl">
                        {emojiFlags[row.polePosition.nationality]?.emoji}
                      </Text>
                    </Td>
                    <Td>
                      <Text as="span" marginInlineEnd="2">
                        {row.winner.name}
                      </Text>
                      <Text as="span" fontSize="xl">
                        {emojiFlags[row.winner.nationality]?.emoji}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
