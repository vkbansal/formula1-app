import { injectGlobal } from '@emotion/css';

injectGlobal`
html {
	& *,
	& *::after,
	& *::before {
		box-sizing: border-box;
	}
}

:root {
	--f1-red: #e10600;
	--black: #1f1f27;
	--text-1: rgba(255, 255, 255, 1);
	--text-2: rgba(255, 255, 255, 0.5);
	--divider: rgba(255, 255, 255, 0.25);
	--header-height: 80px;
	--footer-height: 80px;
	--font-family-oswald: 'Oswald', Verdana, Geneva, Tahoma, sans-serif;
}
body {
	font-family: 'Noto Sans', Verdana, Geneva, Tahoma, sans-serif;
	background-color: var(--black);
	color: whitesmoke;
	font-size: 16px;
	min-height: 100vh;
	margin: 0;
}

p {
	line-height: 1.5;
	margin: 0 0 1rem 0;
}

a {
	color: whitesmoke;

	&[disabled] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}
}

details {
	margin: 1rem 0;
	border: 1px solid var(--divider);
	border-radius: 0.5rem;

	& > summary {
		cursor: pointer;
		padding: 1rem;

		& > * {
			display: inline-block;
			margin: 0;

			&:first-child {
				margin-left: 0.5rem;
			}
		}
	}
}

.container {
	max-width: 1240px;
	margin: 0 auto;

	@media screen and (max-width: 1239px) {
		padding: 0 1rem;
	}
}

.text-right {
	text-align: right !important;
}

.text-2 {
	color: var(--text-2) !important;
}

.last-updated {
	font-size: 0.75rem;
	color: var(--text-2);
}

h1,
h2 {
	margin: 0 0 1rem 0;
	font-family: 'Oswald', Verdana, Geneva, Tahoma, sans-serif;
}

hr {
	border: 0;
	border-top: 1px solid var(--divider);
}

.m-0 {
	margin: 0 !important;
}
`;