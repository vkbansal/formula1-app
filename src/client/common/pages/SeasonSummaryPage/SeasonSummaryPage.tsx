import React from 'react';
import {
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
  Heading
} from '@chakra-ui/react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import emojiFlags from 'emoji-flags';
import { css } from '@emotion/css';
import { YearSelect } from 'client/common/components/YearSelect/YearSelect';

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
    } | null;
    winner: {
      name: string;
      nationality: string;
    } | null;
  }>;
  year: string;
}

const tabIds = ['races', 'driver-standings', 'constructor-standings'];

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
    <React.Fragment>
      <Heading as="h1" display="flex" alignItems="center" marginBlockEnd="8">
        <Text as="span" whiteSpace="nowrap" marginInlineEnd="4">
          Season Summary
        </Text>
        <YearSelect width="auto" value={year} onChange={handleYearChange} />
      </Heading>
      <Tabs isFitted index={tabIndex} onChange={handleTabsChange}>
        <TabList>
          <Tab>Races</Tab>
          <Tab>Driver Standings</Tab>
          <Tab>Constructor Standings</Tab>
        </TabList>

        <TabPanels>
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
                      {row.polePosition ? (
                        <React.Fragment>
                          <Text as="span" marginInlineEnd="2">
                            {row.polePosition.name}
                          </Text>
                          <Text as="span" fontSize="xl">
                            {emojiFlags[row.polePosition.nationality]?.emoji}
                          </Text>
                        </React.Fragment>
                      ) : (
                        '-'
                      )}
                    </Td>
                    <Td>
                      {row.winner ? (
                        <React.Fragment>
                          <Text as="span" marginInlineEnd="2">
                            {row.winner.name}
                          </Text>
                          <Text as="span" fontSize="xl">
                            {emojiFlags[row.winner.nationality]?.emoji}
                          </Text>
                        </React.Fragment>
                      ) : (
                        '-'
                      )}
                    </Td>
                  </Tr>
                ))}
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
        </TabPanels>
      </Tabs>
    </React.Fragment>
  );
}
