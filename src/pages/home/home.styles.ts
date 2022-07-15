import { css } from '@emotion/css';

export const wrapper = css`
	margin: -1rem 0;
`;

export const section = css`
	padding: 4rem 0;
	font-size: 1.75rem;
	color: var(--text-2);
	line-height: 8rem;
`;

export const fact = css`
	font-size: 3rem;
	font-family: var(--font-family-oswald);
	font-weight: 700;
	display: inline-block;
	white-space: nowrap;
	color: white;
`;

export const link = css`
	font-family: var(--font-family-oswald);
	font-weight: 700;
	display: inline-block;
	white-space: nowrap;
	color: white;
	text-decoration: underline;
	text-decoration-style: dashed;
	text-decoration-thickness: 10%;
	transition: color 0.3s ease-out;
	position: relative;
	font-size: 5rem;

	&:hover {
		color: var(--f1-red);
	}
`;
