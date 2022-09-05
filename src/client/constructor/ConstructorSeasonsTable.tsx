import { h, type VNode } from 'preact';
import { formatOrdinals } from 'helpers/utils';
import type { Constructor } from 'helpers/data';

export interface ConstructorSeasonsTableProps {
	maxRounds: number;
	data: Constructor;
}

export function ConstructorSeasonsTable(props: ConstructorSeasonsTableProps): VNode {
	const { maxRounds, data } = props;
	const maxRoundsArr = Array.from({ length: maxRounds });

	return (
		<table class="table table-sm">
			<thead>
				<th>Season</th>
				<th>Driver</th>
				{maxRoundsArr.map((_, i) => (
					<th class="text-center">R{i + 1}</th>
				))}
				<th class="text-center">WCC</th>
			</thead>
			<tbody>
				{data.seasons.flatMap((season) => {
					const wccStanding = data.championshipStandings.find((c) => c.year === season.year);
					const driversInSeason = [...new Set(season.results.map((r) => r.driver))];

					return driversInSeason.map((driver, i) => {
						const driverResults = season.results.filter((r) => r.driver === driver);

						return (
							<tr>
								{i === 0 ? <th rowSpan={driversInSeason.length}>{season.year}</th> : null}
								<td class="driver-name-cell">{driver}</td>
								{maxRoundsArr.map((_, i) => {
									const round = driverResults.find((r) => r.round === i + 1);

									if (i + 1 > season.results.length) {
										return <td>-</td>;
									}

									if (!round) {
										return <td class="text-center">-</td>;
									}

									return (
										<td class="text-center">
											<div>{round.position ? formatOrdinals(round.position) : '-'}</div>
										</td>
									);
								})}
								{i === 0 ? (
									<td class="text-center" rowSpan={driversInSeason.length}>
										{wccStanding ? formatOrdinals(wccStanding.position) : '-'}
									</td>
								) : null}
							</tr>
						);
					});
				})}
			</tbody>
		</table>
	);
}
