import { injectGlobal } from '@emotion/css';

injectGlobal`
.table {
	border-collapse: collapse;
	width: 100%;

	&.table-fixed {
		table-layout: fixed;
	}

	&.table-sticky-header {
		& thead {
			position: sticky;
			top: 0;

			& tr {
				background-color: var(--black);
			}
		}
	}

	& thead tr,
	& tbody tr {
		border-bottom: 1px solid transparent;
		box-shadow: 0px 1px 0px var(--divider);
	}

	& thead tr th,
	& tbody tr td {
		padding: 1rem;
		text-align: left;

		&:first-child {
			padding-left: 2rem;
		}

		&:last-child {
			padding-right: 2rem;
		}
	}

	& thead tr th {
		text-transform: uppercase;
		font-size: 0.85rem;
		color: var(--text-2);
	}

	&.table-sortable {
		& tbody tr td {
			padding-right: 2rem;
		}

		& .sort-btn {
			position: relative;
			cursor: pointer;
			background: transparent;
			border: none;
			width: 100%;
			color: currentColor;
			padding: 1rem 2rem 1rem 1rem;
			text-align: center;

			& > .sort-indicator {
				position: absolute;
				right: 1rem;
				top: 50%;
				transform: translateY(-50%);
				display: inline-block;
				width: 1rem;
				height: 1rem;

				&::before,
				&::after {
					content: '';
					display: block;
					position: absolute;
					right: 0;
					width: 0;
					height: 0;
					border: 0.35rem solid transparent;
					transition: border-color 0.3s ease-in-out;
				}

				&::before {
					top: 0;
					right: 0;
					transform: translateY(-50%);
					border-bottom-color: var(--divider);
				}

				&::after {
					bottom: 0;
					right: 0;
					transform: translateY(50%);
					border-top-color: var(--divider);
				}
			}
		}

		& th[aria-sort='ascending'] .sort-indicator::before {
			border-bottom-color: white;
		}

		& th[aria-sort='descending'] .sort-indicator::after {
			border-top-color: white;
		}

		& thead tr th {
			padding: 0;
			text-align: left;

			&:first-child > .sort-btn {
				padding-left: 2rem;
			}

			&:last-child > .sort-btn {
				padding-right: 2rem;
			}
		}
	}
}

`;