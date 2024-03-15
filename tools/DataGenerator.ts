import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import get from 'just-safe-get';
import omit from 'just-omit';

import driverImages from './driver-images.json' assert { type: 'json' };
import { kebabCase } from 'change-case';
import { Circuits } from './DataGenerator/Circuits';
import { ConstructorResults } from './DataGenerator/ConstructorResults';
import { ConstructorStandings } from './DataGenerator/ConstructorStandings';
import { Constructors, type IConstructor } from './DataGenerator/Constructors';
import { DriverStandings } from './DataGenerator/DriverStandings';
import { Drivers, type IDriver } from './DataGenerator/Drivers';
import { LapTimes } from './DataGenerator/LapTimes';
import { PitStops } from './DataGenerator/PitStops';
import { Qualifying } from './DataGenerator/Qualifying';
import { Races, type IRace } from './DataGenerator/Races';
import { Results } from './DataGenerator/Results';
import { Seasons } from './DataGenerator/Seasons';
import { SprintResults } from './DataGenerator/SprintResults';
import { Status } from './DataGenerator/Status';
import { DriverChampionships } from './DataGenerator/DriverChampionships';
import { ConstructorChampionships } from './DataGenerator/ConstructorChampionships';
import { Teams } from './DataGenerator/Teams';
import { groupByAndMapValues, uniqWith } from './utils';

dayjs.extend(advancedFormat);

export function sluggify(str: string): string {
	return kebabCase(str)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

export class DataGenerator {
	private circuits: Circuits;
	private constructorResults: ConstructorResults;
	private constructorStandings: ConstructorStandings;
	private constructors: Constructors;
	private driverStandings: DriverStandings;
	private drivers: Drivers;
	private lapTimes: LapTimes;
	private pitStops: PitStops;
	private qualifying: Qualifying;
	private races: Races;
	private results: Results;
	private seasons: Seasons;
	private sprintResults: SprintResults;
	private status: Status;

	private driverChampionships: DriverChampionships;
	private constructorChampionships: ConstructorChampionships;
	private teams: Teams;

	constructor() {
		this.circuits = new Circuits();
		this.constructorResults = new ConstructorResults();
		this.constructorStandings = new ConstructorStandings();
		this.constructors = new Constructors();
		this.driverStandings = new DriverStandings();
		this.drivers = new Drivers();
		this.lapTimes = new LapTimes();
		this.pitStops = new PitStops();
		this.qualifying = new Qualifying();
		this.races = new Races();
		this.results = new Results();
		this.seasons = new Seasons();
		this.sprintResults = new SprintResults();
		this.status = new Status();
		this.driverChampionships = new DriverChampionships(
			this.races,
			this.driverStandings,
		);
		this.constructorChampionships = new ConstructorChampionships(
			this.races,
			this.constructorStandings,
		);
		this.teams = new Teams(this.results, this.races);
	}

	getSeasonsInstance(): Seasons {
		return this.seasons;
	}

	getDriversInstance(): Drivers {
		return this.drivers;
	}

	getConstructorsInstance(): Constructors {
		return this.constructors;
	}

	getRacesInstance(): Races {
		return this.races;
	}

	getHomePageData(): unknown {
		return {
			constructorChampions: this.constructorChampionships
				.getData()
				.reduce<
					Set<number>
				>((acc, championship) => (championship.position === 1 ? acc.add(championship.constructorId) : acc), new Set())
				.size,
			constructors: this.constructors.getData().length,
			driverChampions: this.driverChampionships
				.getData()
				.reduce<
					Set<number>
				>((acc, championship) => (championship.position === 1 ? acc.add(championship.driverId) : acc), new Set())
				.size,
			drivers: this.drivers.getData().length,
			races: this.results
				.getData()
				.reduce<Set<number>>((acc, race) => acc.add(race.raceId), new Set())
				.size,
			seasons: this.seasons.getData().length,
		};
	}

	getSeasonsList(): unknown[] {
		return this.seasons
			.getData()
			.map((season) => ({
				year: season.year,
				totalRaces: this.races.getRacesBySeason(season.year).length,
			}))
			.toSorted((a, b) => b.year - a.year);
	}

	getSeasonData(year: number): unknown {
		const rounds = this.races.getRacesBySeason(year).map((race) => {
			const circuit = this.circuits.getCircuitByCircuitId(race.circuitId)!;

			const driverStandings = this.driverStandings
				.getDriverStandingsByRaceId(race.raceId)
				.map((standing) => {
					return {
						points: standing.points,
						position: standing.position,
						wins: standing.wins,
						driverRef: this.drivers.getDriverRefByDriverId(standing.driverId),
					};
				});
			const constructorStandings = this.constructorStandings
				.getConstructorStandingsByRaceId(race.raceId)
				.map((standing) => {
					return {
						points: standing.points,
						position: standing.position,
						wins: standing.wins,
						constructorRef: this.constructors.getConstructorRefByConstructorId(
							standing.constructorId,
						),
					};
				});

			const podium = this.results
				.getPodiumsByRaceId(race.raceId)
				.map((podium) => {
					return {
						constructorRef: this.constructors.getConstructorRefByConstructorId(
							podium.constructorId,
						),
						driverRef: this.drivers.getDriverRefByDriverId(podium.driverId),
						position: podium.position,
					};
				});

			return {
				circuit: {
					name: circuit.name,
					location: circuit.location,
					country: circuit.country,
				},
				date: dayjs(race.date).format('Do MMM YYYY'),
				name: race.name,
				round: race.round,
				slug: sluggify(race.name),
				driverStandings,
				constructorStandings,
				podium,
			};
		});

		const teams = Object.entries(
			groupByAndMapValues(
				this.teams.getTeamsBySeason(year),
				'constructorId',
				(val) => val,
			),
		)
			.map(([constructorId, teams]) => {
				const _constructor = this.constructors.getConstructorByConstructorId(
					parseInt(constructorId, 10),
				)!;

				return {
					constructorRef: _constructor.constructorRef,
					name: _constructor.name,
					nationality: _constructor.nationality,
					drivers: teams.map((team) => {
						const driver = this.drivers.getDriverByDriverId(team.driverId)!;

						return {
							driverRef: driver.driverRef,
							name: `${driver.forename} ${driver.surname}`,
							nationality: driver.nationality,
						};
					}),
				};
			})
			.toSorted((a, b) => a.constructorRef.localeCompare(b.constructorRef));

		return {
			rounds,
			teams,
			year,
		};
	}

	getDriverData(d: IDriver): unknown {
		const championshipStandings = this.driverChampionships
			.getDriverChampionshipByDriverId(d.driverId)
			.map((standing) => ({
				position: standing.position,
				year: standing.year,
			}))
			.toSorted((a, b) => a.year - b.year);
		const image = get(driverImages, d.driverRef, null);
		const allLaps = this.lapTimes.getLapTimesByDriverId(d.driverId);
		const lapsLead = allLaps.filter((lap) => lap.position === 1);
		const results = this.results
			.getResultsByDriverId(d.driverId)
			.map((result) => {
				const race = this.races.getRaceByRaceId(result.raceId)!;
				const _constructor = this.constructors.getConstructorByConstructorId(
					result.constructorId,
				)!;

				return {
					constructor: _constructor.name,
					points: result.points,
					position: result.position,
					round: race.round,
					roundName: race.name,
					year: race.year,
				};
			});
		const podiums = results.filter(
			(result) => typeof result.position === 'number' && result.position <= 3,
		);
		const raceWins = results.filter(
			(result) => typeof result.position === 'number' && result.position === 1,
		);
		const seasons = Object.entries(
			groupByAndMapValues(results, 'year', (val) => val),
		)
			.map(([year, results]) => ({
				year: parseInt(year, 10),
				results: results.map(({ year, ...result }) => result),
			}))
			.toSorted((a, b) => a.year - b.year);

		const poles = this.qualifying
			.getQualifyingByDriverId(d.driverId)
			.filter((q) => q.position === 1).length;

		return {
			championshipStandings,
			dob: d.dob,
			code: d.code,
			driverId: d.driverId,
			driverRef: d.driverRef,
			image,
			lapsLead: lapsLead.length,
			name: `${d.forename} ${d.surname}`,
			nationality: d.nationality,
			podiums: podiums.length,
			poles,
			raceWins: raceWins.length,
			seasons,
			totalLaps: allLaps.length,
			totalRaces: results.length,
		};
	}

	getConstructorData(c: IConstructor): unknown {
		const championshipStandings = this.constructorChampionships
			.getConstructorChampionshipByConstructorId(c.constructorId)
			.map((standing) => ({
				position: standing.position,
				year: standing.year,
			}))
			.toSorted((a, b) => a.year - b.year);
		const results = this.results
			.getResultsByConstructorId(c.constructorId)
			.map((result) => {
				const race = this.races.getRaceByRaceId(result.raceId)!;

				return {
					driver: this.drivers.getDriverNameByDriverId(result.driverId),
					points: result.points,
					position: result.position,
					round: race.round,
					roundName: race.name,
					year: race.year,
				};
			});

		const podiums = results.filter(
			(result) => typeof result.position === 'number' && result.position <= 3,
		);
		const raceWins = results.filter(
			(result) => typeof result.position === 'number' && result.position === 1,
		);
		const seasons = Object.entries(
			groupByAndMapValues(results, 'year', (val) => val),
		)
			.map(([year, results]) => ({
				year: parseInt(year, 10),
				rounds: Object.values(
					groupByAndMapValues(results, 'round', (val) => val),
				).map((roundResults) => ({
					round: roundResults[0]!.round,
					roundName: roundResults[0]!.roundName,
					results: roundResults
						.map((result) => omit(result, 'year', 'round', 'roundName'))
						.toSorted((a, b) => (b.position || 0) - (a.position || 0)),
				})),
			}))
			.toSorted((a, b) => a.year - b.year);

		const totalRaces = uniqWith(
			results,
			(a, b) => a.year === b.year && a.round === b.round,
		).length;

		return {
			championshipStandings,
			constructorId: c.constructorId,
			constructorRef: c.constructorRef,
			name: c.name,
			nationality: c.nationality,
			podiums: podiums.length,
			raceWins: raceWins.length,
			totalRaces: totalRaces,
			winPct: (raceWins.length / totalRaces) * 100,
			seasons,
		};
	}

	getRoundData(race: IRace, slug: string): unknown {
		const circuit = this.circuits.getCircuitByCircuitId(race.circuitId)!;
		const qualifying = this.qualifying.getQualifyingByRaceId(race.raceId);
		const results = this.results.getResultsByRaceId(race.raceId);
		const laps = this.lapTimes.getLapTimesByRaceId(race.raceId);
		const pitStops = this.pitStops.getPitStopsByRaceId(race.raceId);

		const driversData = this.results
			.getResultsByRaceId(race.raceId)
			.map((result) => {
				const driverQualifying = qualifying.find(
					(q) => q.driverId === result.driverId,
				);
				const driverResult = results.find(
					(r) => r.driverId === result.driverId,
				);
				const lapPositions = laps
					.filter((lap) => lap.driverId === result.driverId)
					.toSorted((a, b) => a.lap - b.lap)
					.map((lap) => lap.position);

				const driverPitStops = pitStops
					.filter((pitStop) => pitStop.driverId === result.driverId)
					.map((pitStop) => ({ lap: pitStop.lap, stop: pitStop.stop }));

				return {
					constructorRef: this.constructors.getConstructorRefByConstructorId(
						result.constructorId,
					),
					driverRef: this.drivers.getDriverRefByDriverId(result.driverId),
					grid: driverResult?.grid,
					points: driverResult?.points,
					position: driverResult?.position,
					positionText: String(driverResult?.positionText),
					positionOrder: driverResult?.positionOrder,
					lapPositions,
					pitStops: driverPitStops,
					qualifying: {
						position: driverQualifying?.position,
						q1: driverQualifying?.q1 || null,
						q2: driverQualifying?.q2 || null,
						q3: driverQualifying?.q3 || null,
					},
				};
			});

		return {
			circuit: {
				circuitRef: circuit.circuitRef,
				name: circuit.name,
				location: circuit.location,
				country: circuit.country,
			},
			date: race.date,
			driversData,
			slug,
			name: race.name,
			raceId: race.raceId,
			round: race.round,
			year: race.year,
		};
	}
}
