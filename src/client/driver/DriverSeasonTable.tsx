import { h, type VNode } from 'preact';
import { formatOrdinals } from 'helpers/utils';
import type { Driver } from 'helpers/data';

export interface DriverSeasonTableProps {
	maxRounds: number;
	driver: Driver;
}

export function DriverSeasonTable(props: DriverSeasonTableProps): VNode {
	const { maxRounds, driver } = props;
	const maxRoundsArr = Array.from({ length: maxRounds });

	return (
		<table class="table">
			<thead>
				<th>Season</th>
				{maxRoundsArr.map((_, i) => (
					<th>R{i + 1}</th>
				))}
				<th>WDC</th>
			</thead>
			<tbody>
				{driver.seasons.map((season) => {
					const wdcStanding = driver.championshipStandings.find((c) => c.year === season.year);
					return (
						<tr>
							<th>{season.year}</th>
							{maxRoundsArr.map((_, i) => {
								const round = season.results.find((r) => r.round === i + 1);

								if (i + 1 > season.results.length) {
									return <td>-</td>;
								}

								if (!round) {
									return <td>-</td>;
								}

								return (
									<td>
										<div>{round.position ? formatOrdinals(round.position) : '-'}</div>
									</td>
								);
							})}
							<td>{wdcStanding ? formatOrdinals(wdcStanding.position) : '-'}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
