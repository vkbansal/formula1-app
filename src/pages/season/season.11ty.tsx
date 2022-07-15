import { h, type VNode } from 'preact';
import { parseISO as parseISODate, format as formatDate } from 'date-fns';

import type { Seasons } from '11ty-global-data/seasons';
import { mapKeys, pick } from 'helpers/objectHelpers';
import { loadJsonFromDir } from 'helpers/readJson';
import { MainLayout } from 'layouts/MainLayout';

import type { CommonData, CommonTemplateConfig, PreactThis } from 'types/11ty';
import type {
	F1Constructor,
	F1Driver,
	F1Race,
	F1SeasonConstructor,
	F1SeasonDriver,
} from 'types/data';
import colors from 'helpers/colors';

import * as css from './season.styles';
import { BreadCrumbs } from 'components/BreadCrumbs';

const shortKeysMap = {
	position: 'ps',
	points: 'pt',
	wins: 'w',
};

export interface ChartPoint {
	ps: number;
	pt: number;
	w: number;
}

export interface ChartData {
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
	racesData: TableData[];
	driversData: ChartData[];
	constructorsData: ChartData[];
}

export interface Data extends CommonData<Seasons[number]> {
	year: number;
}

export async function getData(): Promise<
	CommonTemplateConfig<Data, ComputedData>
> {
	return {
		pagination: {
			data: 'seasons',
			size: 1,
			alias: 'year',
		},
		permalink: (opts: Data): string => `/seasons/${opts.year}/`,
		eleventyComputed: async (opts: Data): Promise<ComputedData> => {
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
					label: d.name,
					color: colors[i],
					data: racesArr.map<ChartPoint | null>((r) => {
						const result = r.driverStandings.find(
							(s) => s.driverRef === d.driverRef,
						);
						return result
							? mapKeys<ChartPoint>(
									pick(result, ['position', 'points', 'wins']),
									(key) => shortKeysMap[key],
							  )
							: null;
					}),
				};
			});

			const constructorsData: ChartData[] = constructorsArr.map((c, i) => {
				return {
					label: c.name,
					color: colors[i],
					data: racesArr.map((r) => {
						const result = r.constructorStandings.find(
							(s) => s.constructorRef === c.constructorRef,
						);
						return result
							? mapKeys<ChartPoint>(
									pick(result, ['position', 'points', 'wins']),
									(key) => shortKeysMap[key],
							  )
							: null;
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

			return {
				racesData: racesData,
				driversData,
				constructorsData,
			};
		},
	};
}

export type RenderProps = Data & ComputedData;

export function render(this: PreactThis, props: RenderProps): VNode {
	const {
		metadata,
		year,
		pagination,
		driversData,
		racesData: races,
		constructorsData,
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
