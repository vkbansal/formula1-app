import { css } from '@emotion/css';

export const seasonTabs = css`
	margin: 0 0 2rem 0;

	& .tab-panel.races-table-tab {
		padding: 1rem 0 3rem 0;
	}

	& .circuit-location-cell {
		font-size: 0.85em;
		opacity: 0.5;
		font-style: italic;
	}

	& .tab-panel {
		padding: 0 2rem 2rem 2rem;
	}

	& .line-group {
		cursor: pointer;

		& > circle:hover {
			fill: white;
		}
	}

	& .points-chart {
		display: grid;
		grid-template-columns: 4fr minmax(400px, 1fr);
	}

	& .points-legend {
		padding-top: 2rem;
		font-size: 0.875rem;
	}

	& .points-legend-race {
		font-family: var(--font-family-oswald);
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	& .points-legend-position {
		display: grid;
		grid-template-columns: 4ch 1fr;
		column-gap: 0.5em;

		& > span[data-gain] {
			font-size: 0.875em;
			opacity: 0.7;
		}

		& > span[data-gain='1']::before {
			content: '▲';
			color: green;
		}

		& > span[data-gain='-1']::before {
			content: '▼';
			color: red;
		}
	}

	& .points-legend-label {
		display: flex;
		align-items: center;

		&::before {
			content: '';
			display: block;
			width: 1em;
			height: 1em;
			border-radius: 2px;
			background-color: var(--legend-color);
			margin-right: 0.5em;
		}
	}
`;

export const seasonHeader = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 1rem 0;

	& h1 {
		margin: 0;
	}
`;

export const seasonPagination = css`
	display: flex;
	justify-content: space-between;
	column-gap: 1rem;

	& a {
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
`;
