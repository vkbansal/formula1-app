import { h, type VNode } from 'preact';
import { parseISO as parseISODate, format as formatDate } from 'date-fns';

import { pick } from 'helpers/objectHelpers';
import { loadJsonFromDir } from 'helpers/readJson';
import { MainLayout } from 'layouts/MainLayout';

import type { CommonData, CommonTemplateConfig, PreactThis } from 'types/11ty';
import type {
	F1Constructor,
	F1Driver,
	F1DriverStanding,
	F1Race,
	F1SeasonConstructor,
	F1SeasonDriver,
} from 'types/data';
import colors from 'helpers/colors';

import * as css from './season.styles';
import { BreadCrumbs } from 'components/BreadCrumbs';

export type ChartPoint = Omit<F1DriverStanding, 'driverRef'>;

export interface ChartData {
	id: string;
	label: string;
	color: string;
	data: Array<null | ChartPoint>;
}

export interface TableData
	extends Pick<F1Race, 'raceId' | 'round' | 'date' | 'name' | 'circuit'> {
	winner: {
		driver: Pick<F1Driver, 'name' | 'nationality'> | null;
		constructor: Pick<F1Constructor, 'name' | 'nationality'> | null;
	};
}

export interface ComputedData {
	lastestRoundWithResults: number;
	racesData: TableData[];
	driversData: ChartData[];
	constructorsData: ChartData[];
}

export interface ExtraPageData {
	year: number;
}

export async function getData(): Promise<
	CommonTemplateConfig<ExtraPageData, ComputedData>
> {
	return {
		pagination: {
			data: 'seasons',
			size: 1,
			alias: 'year',
		},
		permalink: (opts): string => `/seasons/${opts.year}/`,
		eleventyComputed: async (opts): Promise<ComputedData> => {
			const { year } = opts;
			const {
				constructors: seasonConstructors = [],
				drivers: seasonDrivers = [],
			} = await loadJsonFromDir<
				{
					drivers: F1SeasonDriver[];
					constructors: F1SeasonConstructor[];
				},
				unknown
			>(`data/seasons/${year}`);
			const races = await loadJsonFromDir<F1Race>(`data/seasons/${year}/races`);
			const racesArr = Object.values(races).sort((a, b) => a.round - b.round);
			const constructors = await loadJsonFromDir<F1Constructor>(
				`data/constructors`,
				seasonConstructors.map(({ constructorRef }) => constructorRef),
			);
			const drivers = await loadJsonFromDir<F1Driver>(
				`data/drivers`,
				seasonDrivers.map(({ driverRef }) => driverRef),
			);
			const driversArr = Object.values(drivers);
			const constructorsArr = Object.values(constructors);

			const driversData: ChartData[] = driversArr.map((d, i) => {
				return {
					id: d.driverRef,
					label: d.name,
					color: colors[i],
					data: racesArr.map<ChartPoint | null>((r) => {
						const result = r.driverStandings.find(
							(s) => s.driverRef === d.driverRef,
						);
						return result ? pick(result, ['position', 'points', 'wins']) : null;
					}),
				};
			});

			const constructorsData: ChartData[] = constructorsArr.map((c, i) => {
				return {
					id: c.constructorRef,
					label: c.name,
					color: colors[i],
					data: racesArr.map((r) => {
						const result = r.constructorStandings.find(
							(s) => s.constructorRef === c.constructorRef,
						);
						return result ? pick(result, ['position', 'points', 'wins']) : null;
					}),
				};
			});

			const racesData = racesArr.map<TableData>((race) => {
				return {
					raceId: race.raceId,
					round: race.round,
					name: race.name,
					date: formatDate(parseISODate(race.date), 'do LLL yyyy'),
					circuit: race.circuit,
					winner: {
						driver: drivers[race.winnerDriver]
							? {
									name: drivers[race.winnerDriver].name,
									nationality: drivers[race.winnerDriver].nationality,
							  }
							: null,
						constructor: constructors[race.winnerConstructor]
							? {
									name: constructors[race.winnerConstructor].name,
									nationality: constructors[race.winnerConstructor].nationality,
							  }
							: null,
					},
				};
			});

			let lastestRoundWithResults = racesArr.findIndex(
				(r) => r.driverStandings.length === 0,
			);

			// final race of the season
			if (lastestRoundWithResults === -1) {
				lastestRoundWithResults = racesArr.length;
			}

			return {
				lastestRoundWithResults,
				racesData: racesData,
				driversData,
				constructorsData,
			};
		},
	};
}

export type RenderProps = ExtraPageData & CommonData<number> & ComputedData;

export function render(this: PreactThis, props: RenderProps): VNode {
	const {
		metadata,
		year,
		pagination,
		driversData,
		racesData: races,
		constructorsData,
		lastestRoundWithResults,
	} = props;
	return (
		<MainLayout title={`${year} Season`}>
			<BreadCrumbs
				links={[
					{ label: 'Seasons', href: '/seasons/' },
					{ label: `${year}`, href: '' },
				]}
			/>
			<div class={css.seasonHeader}>
				<h1>
					{year} Season{' '}
					{metadata.currentSeason === year ? '(Current Season)' : ''}
				</h1>
				<nav class={css.seasonPagination}>
					{pagination.href.previous ? (
						<a href={pagination.href.previous}>&larr; {year - 1}</a>
					) : null}
					{pagination.href.next ? (
						<a href={pagination.href.next}>{year + 1} &rarr;</a>
					) : null}
				</nav>
			</div>
			<div id="tabs-target" className={css.seasonTabs} />
			<script
				defer
				type="text/javascript"
				dangerouslySetInnerHTML={{
					__html: [
						`const lastestRoundWithResults=${JSON.stringify(
							lastestRoundWithResults,
						)}`,
						`const driversData=${JSON.stringify(driversData)}`,
						`const racesData=${JSON.stringify(races)}`,
						`const constructorsData=${JSON.stringify(constructorsData)}`,
					].join(';'),
				}}
			/>
			<script
				defer
				type="text/javascript"
				src={this.context.filters.assets(
					'pages/season/client/index.tsx',
					'season',
				)}
			/>
		</MainLayout>
	);
}
