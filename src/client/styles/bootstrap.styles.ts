import { injectGlobal } from '@emotion/css';

injectGlobal`
html {
	& *,
	& *::after,
	& *::before {
		box-sizing: border-box;
	}

	--f1-red: #e10600;
	--black: #1f1f27;
	--white: #f5f5f5;
	--header-height: 80px;
	--footer-height: 80px;
	--font-family-oswald: 'Oswald', Verdana, Geneva, Tahoma, sans-serif;


	&[data-theme="dark"] {
		--text-1: var(--white);
		--text-2: rgba(255, 255, 255, 0.5);
		--divider: rgba(255, 255, 255, 0.25);
		--bg: var(--black);
	}

	&[data-theme="light"] {
		--text-1: var(--black);
		--text-2: rgba(0, 0, 0, 0.5);
		--divider: rgba(0, 0, 0, 0.25);
		--bg: var(--white);
	}
}

body {
	font-family: 'Noto Sans', Verdana, Geneva, Tahoma, sans-serif;
	background-color: var(--bg);
	color: var(--text-1);
	font-size: 16px;
	min-height: 100vh;
	margin: 0;
}

p {
	line-height: 1.5;
	margin: 0 0 1rem 0;
}

a {
	color: var(--text-1);

	&[disabled] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}
}

.container {
	margin: 0 auto;
	max-width: 1920px;

	@media screen and (max-width: 1920px) {
		padding: 0 2rem;
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
