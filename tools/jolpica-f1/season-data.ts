/* eslint-disable @cspell/spellchecker */
import { Presets, SingleBar } from 'cli-progress';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { z } from 'zod';

import {
	ConstructorSchema,
	ConstructorStandingsSchema,
	DriverSchema,
	DriverStandingsSchema,
	getAPIResponseSchema,
	RaceSchema,
} from './schemas';
import { ky, sleep, slugify } from './utils';

dayjs.extend(advancedFormat);

const SeasonRacesAPIResponseSchema = getAPIResponseSchema({
	RaceTable: z.object({
		season: z.coerce.number(),
		Races: z.array(RaceSchema),
	}),
});

const SeasonConstructorAPIResponseSchema = getAPIResponseSchema({
	ConstructorTable: z.object({
		season: z.coerce.number(),
		Constructors: z.array(ConstructorSchema),
	}),
});

const SeasonConstructorDriverAPIResponseSchema = getAPIResponseSchema({
	DriverTable: z.object({
		season: z.coerce.number(),
		Drivers: z.array(DriverSchema),
	}),
});

const SeasonDriverStandingsAPIResponseSchema = getAPIResponseSchema({
	StandingsTable: z.object({
		season: z.coerce.number(),
		round: z.coerce.number(),
		StandingsLists: z.array(
			z.object({
				season: z.coerce.number(),
				round: z.coerce.number(),
				DriverStandings: z.array(DriverStandingsSchema),
			}),
		),
	}),
});

const SeasonConstructorStandingsAPIResponseSchema = getAPIResponseSchema({
	StandingsTable: z.object({
		season: z.coerce.number(),
		round: z.coerce.number(),
		StandingsLists: z.array(
			z.object({
				season: z.coerce.number(),
				round: z.coerce.number(),
				ConstructorStandings: z.array(ConstructorStandingsSchema),
			}),
		),
	}),
});

export async function getSeasonData(year: number): Promise<unknown> {
	const racesApiData = await ky.get(`${year}/races.json`).json();

	const constructorsApiData = await ky.get(`${year}/constructors.json`).json();

	const {
		MRData: {
			RaceTable: { Races },
		},
	} = SeasonRacesAPIResponseSchema.parse(racesApiData);

	const {
		MRData: {
			ConstructorTable: { Constructors },
		},
	} = SeasonConstructorAPIResponseSchema.parse(constructorsApiData);

	const rounds = Races.map((race) => {
		return {
			circuit: {
				name: race.Circuit.circuitName,
				location: race.Circuit.Location.locality,
				country: race.Circuit.Location.country,
			},
			date: dayjs(race.date).format('Do MMM YYYY'),
			name: race.raceName,
			round: race.round,
			slug: slugify(race.raceName),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			driverStandings: [] as any[],
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			constructorStandings: [] as any[],
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			podium: [] as any[],
		};
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const teams: any[] = [];

	const driversBar = new SingleBar(
		{ format: ' {bar} {value}/{total}  Fetching drivers for {name}' },
		Presets.shades_classic,
	);

	driversBar.start(Constructors.length, 0);

	for (const team of Constructors) {
		driversBar.increment(1, team);
		const driversApiData = await ky
			.get(`${year}/constructors/${team.constructorId}/drivers.json`)
			.json();

		const {
			fromCache,
			MRData: {
				DriverTable: { Drivers },
			},
		} = SeasonConstructorDriverAPIResponseSchema.parse(driversApiData);

		teams.push({
			constructorRef: team.constructorId,
			drivers: Drivers.map((driver) => ({
				driverRef: driver.driverId,
				name: `${driver.givenName} ${driver.familyName}`,
				nationality: driver.nationality,
			})),
			name: team.name,
			nationality: team.nationality,
		});

		if (!fromCache) {
			await sleep(1000);
		}
	}

	driversBar.stop();

	const latestRaceIndex =
		Races.findIndex((race) => dayjs(race.date).isAfter(dayjs(), 'date')) - 1;

	const completedRaces = rounds.slice(0, latestRaceIndex);

	// eslint-disable-next-line no-console
	console.log(`\nCompleted ${completedRaces.length} races\n`);

	const racesBar = new SingleBar(
		{ format: ' {bar} {value}/{total} Fetching standings for {name}' },
		Presets.shades_classic,
	);

	racesBar.start(completedRaces.length, 0);

	for (const race of completedRaces) {
		const round = rounds[race.round - 1];

		if (!round || round.name !== race.name) {
			throw new Error(`Mismatch in races order: ${race.name}`);
		}

		racesBar.increment(1, race);

		const driverStandingsApiData = await ky
			.get(`${year}/${race.round}/driverstandings.json`)
			.json();

		const {
			fromCache: driverStandingsFromCache,
			MRData: {
				StandingsTable: { StandingsLists: DriverStandingsList },
			},
		} = SeasonDriverStandingsAPIResponseSchema.parse(driverStandingsApiData);

		const DriverStandings = DriverStandingsList[0]!.DriverStandings;

		round.driverStandings = DriverStandings.map((driver, index) => ({
			driverRef: driver.Driver.driverId,
			points: driver.points,
			position: driver.position ?? index + 1,
			wins: driver.wins,
		}));

		if (!driverStandingsFromCache) {
			await sleep(1000);
		}

		const constructorStandingsApiData = await ky
			.get(`${year}/${race.round}/constructorstandings.json`)
			.json();

		const {
			fromCache: constructorStandingsFromCache,
			MRData: {
				StandingsTable: { StandingsLists: ConstructorStandingsList },
			},
		} = SeasonConstructorStandingsAPIResponseSchema.parse(
			constructorStandingsApiData,
		);

		const ConstructorStandings =
			ConstructorStandingsList[0]!.ConstructorStandings;

		round.constructorStandings = ConstructorStandings.map((con) => ({
			constructorRef: con.Constructor.constructorId,
			points: con.points,
			position: con.position,
			wins: con.wins,
		}));

		if (!constructorStandingsFromCache) {
			await sleep(1000);
		}
	}

	racesBar.stop();

	return { rounds, teams, year };
}
