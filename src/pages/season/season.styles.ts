import { css } from '@emotion/css';

export const seasonTabs = css`
	& .circuit-location-cell {
		font-size: 0.85em;
		opacity: 0.5;
		font-style: italic;
	}

	& .tab-panel {
		padding-bottom: 2rem;
	}
}`;

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
}`;

// .season-graph {
// 	margin: 1rem;
// 	position: relative;

// 	& .positions-chart {
// 		--fade-opacity: 0.1;

// 		:global {
// 			& .legend-row {
// 				transition: opacity 0.3s ease-out;
// 				cursor: pointer;
// 				opacity: 1;

// 				&.legend-row-fade {
// 					opacity: var(--fade-opacity);
// 				}
// 			}

// 			& .line-group {
// 				cursor: pointer;

// 				& > .label {
// 					opacity: 0;
// 					transition: opacity 0.3s ease-out;
// 				}

// 				& > .line,
// 				& > .point {
// 					opacity: 1;
// 					transition: opacity 0.3s ease-out;
// 				}

// 				&.line-group-focus {
// 					& > .label {
// 						opacity: 1;
// 					}
// 				}

// 				&.line-group-fade {
// 					& > .line,
// 					& > .point {
// 						opacity: var(--fade-opacity);
// 					}
// 				}
// 			}
// 		}
// 	}

// 	& .points-tooltip {
// 		overflow: hidden;
// 		max-height: 80vh;
// 		min-height: 300px;

// 		& :global(.tooltip-content) {
// 			height: 100%;
// 			columns: auto;
// 		}

// 		& :global(.race-name) {
// 			font-weight: 600;
// 			text-align: center;
// 			font-size: 1.2rem;
// 			margin-bottom: 0.5rem;
// 		}

// 		& :global(.points-row) {
// 			display: grid;
// 			grid-template-columns: 1rem var(--longest-name) 6ch 8ch 4ch;
// 			grid-template-rows: auto;
// 			gap: 0 0.5rem;

// 			&:global(.points-header) {
// 				font-weight: bold;
// 			}
// 		}

// 		& :global(.color) {
// 			width: 1rem;
// 			height: 1rem;
// 			background-color: currentColor;
// 			border-radius: 0.2rem;
// 		}
// 	}

// 	& .points-chart {
// 		opacity: 1;
// 	}
// }