/* global raceNames, d3, Popper */
import colors from '../../../common-client/colors';
import { formatOrdinals } from '../../../common-client/helpers';

const TEMP_RANK = 9999;

function getTooltipRowContent(row) {
	const color = `<div class="color" style="color:${row.color};"></div>`;
	const label = `<div>${row.label}</div>`;

	if (row.data.ps === TEMP_RANK) {
		return `
		<div class="points-row">
			${color}
			${label}
			<div>N/A</div>
			<div>N/A</div>
			<div>N/A</div>
		</div>`;
	}

	return `
	<div class="points-row">
		${color}
		${label}
		<div class="text-right">${row.data.pt}</div>
		<div class="text-right">${formatOrdinals(row.data.ps)}</div>
		<div class="text-right">${row.data.w}</div>
	</div>`;
}
