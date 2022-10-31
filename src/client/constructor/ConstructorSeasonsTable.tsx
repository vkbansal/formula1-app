import { h, type VNode } from 'preact';
import cx from 'classnames';
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
		<table class="table table-sm constructor-results-table">
			<thead>
				<tr class="table-divider">
					<th>Season</th>
					<th>Driver</th>
					{maxRoundsArr.map((_, i) => (
						<th class="text-center">R{i + 1}</th>
					))}
					<th class="text-center">WCC</th>
				</tr>
			</thead>
			<tbody>
				{data.seasons.flatMap((season) => {
					const wccStanding = data.championshipStandings.find((c) => c.year === season.year);
					const driversInSeason = [
						...new Set(
							season.rounds.flatMap((round) => round.results.map((result) => result.driver)),
						),
					];

					return driversInSeason.map((driver, i) => {
						return (
							<tr class={cx({ 'table-divider': i === driversInSeason.length - 1 })}>
								{i === 0 ? <th rowSpan={driversInSeason.length}>{season.year}</th> : null}
								<td class="driver-name-cell">{driver}</td>
								{maxRoundsArr.map((_, i) => {
									const round = season.rounds.find((round) => round.round === i + 1);
									const driverResult = round?.results.find((result) => result.driver === driver);

									if (i + 1 > season.rounds.length || !round || !driverResult?.position) {
										return <td class="text-center">-</td>;
									}

									return (
										<td class="text-center">
											<div>{formatOrdinals(driverResult.position)}</div>
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
