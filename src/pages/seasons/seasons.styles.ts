import { css } from '@emotion/css';

export const seasonsGrid = css`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	border-radius: 1rem;
	overflow: hidden;
	border: 1px solid var(--divider);
	margin-bottom: 2rem;
`;

export const seasonCard = css`
	margin: 0;
	font-size: 2rem;
	overflow: hidden;
	aspect-ratio: 1 / 1;

	& > a {
		display: flex;
		text-decoration: none;
		align-items: center;
		justify-content: center;
		transform-origin: center center;
		transition: transform 0.2s ease-in-out;
		width: 100%;
		height: 100%;

		&:hover {
			transform: scale(1.35);
		}
	}

	&:nth-child(2n) > a {
		background: var(--white);
		color: var(--black);
	}

	&:nth-child(2n + 1) > a {
		background: var(--black);
		color: var(--white);
	}
`;
