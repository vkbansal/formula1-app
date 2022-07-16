import { css } from '@emotion/css';

export const seasonTabs = css`
	margin: 0 -2rem;

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
		grid-template-columns: 4fr 1fr;
	}

	& .points-legend {
		padding-top: 2rem;
		font-size: 0.875rem;
	}

	& .points-legend-race {
		font-family: var(--font-family-oswald);
		font-size: 1rem;
		margin-bottom: 1em;
	}

	& .points-legend-label {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
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
