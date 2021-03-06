import React from 'react';
import {
  Container,
  Text,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@chakra-ui/react';
import emojiFlags from 'emoji-flags';

export interface DriverStandingsPageProps {
  module: 'rest' | 'graphql';
  year: string;
  name: string;
  nationality: string;
  races: Array<{
    round: number;
    name: string;
    date: string;
    points: number;
    cumulativePoints: number;
    position: number;
    racePosition: number;
  }>;
}

export function DriverStandingsPage(
  props: DriverStandingsPageProps
): React.ReactElement {
  const { name, nationality, year, races } = props;
  return (
    <Container paddingBlock="4">
      <Heading as="h1">
        <span>Driver Standings - {name}</span>
        <Text as="span" marginInline="2">
          {emojiFlags[nationality]?.emoji}
        </Text>
      </Heading>
      <Heading
        as="h2"
        fontSize="1.5rem"
        color="gray.500"
        marginBlockStart="1"
        marginBlockEnd="6"
      >
        Year: {year}
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Round</Th>
            <Th>Date</Th>
            <Th>Name</Th>
            <Th>Race Position</Th>
            <Th>Points</Th>
            <Th>Cumulative Points</Th>
            <Th>Position</Th>
          </Tr>
        </Thead>
        <Tbody>
          {races.map((race, i) => {
            const prevPosition = races[i - 1]?.position;
            const gain = prevPosition
              ? Math.sign(prevPosition - race.position)
              : 0;

            return (
              <Tr key={race.round}>
                <Td>{race.round}</Td>
                <Td>{race.date}</Td>
                <Td>{race.name}</Td>
                <Td>{race.racePosition}</Td>
                <Td>{race.points}</Td>
                <Td>{race.cumulativePoints}</Td>
                <Td>
                  <span>{race.position}</span>
                  {gain > 0 ? (
                    <Text as="span" marginInlineStart="2" color="green.500">
                      &uarr;
                    </Text>
                  ) : gain < 0 ? (
                    <Text as="span" marginInlineStart="2" color="red.500">
                      &darr;
                    </Text>
                  ) : null}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
}
