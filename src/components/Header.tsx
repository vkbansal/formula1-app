import { h, type VNode } from 'preact';
import { css, cx } from '@emotion/css';
import type { PreactThis } from 'types/11ty';

const main = css`
	padding: 1rem 0;
	border-bottom: 1px solid var(--divider);
	height: var(--header-height);

	& > .container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
	}
`;

const logo = css`
	display: block;
	font-size: 2.5rem;
	text-decoration: none;
	font-family: var(--font-family-oswald);
	font-weight: 500;

	& span:first-child {
		color: var(--f1-red);
		font-weight: 700;
	}
`;

const nav = css`
	display: flex;
	align-items: center;
	column-gap: 1.5rem;
	font-family: var(--font-family-oswald);
`;

const navLink = css`
	text-decoration: none;
	font-weight: bold;
	transform-origin: center center;
	transition: 0.2s ease-in-out;

	&:hover {
		transform: scale(1.1);
	}

	&.active {
		color: var(--f1-red);
		transform: scale(1.1);
	}
`;

const navLinkActive = css`
	color: var(--f1-red);
	transform: scale(1.1);
`;

const SWITCH_WIDTH = `2.75rem`;
const SWITCH_HEIGHT = `1.25rem`;
const TOGGLE_SCALE = 0.8;
const TOGGLE_SIZE = `calc(${SWITCH_HEIGHT} * ${TOGGLE_SCALE})`;
const DELTA = `calc(calc(${SWITCH_HEIGHT} - ${TOGGLE_SIZE}) / 2)`;
const INNER_WIDTH = `calc(${SWITCH_WIDTH} - calc(${DELTA} * 2))`;

const themeToggle = css`
	display: inline-flex;
	align-items: center;
	height: ${SWITCH_HEIGHT};
	width: ${SWITCH_WIDTH};
	border-radius: ${SWITCH_HEIGHT};
	background: var(--black);
	position: relative;
	overflow: hidden;
	box-shadow: 0 0 0 1px var(--text-2);
	cursor: pointer;

	& > input {
		opacity: 0;
		clip-path: circle(0, 0);
		width: 0;
		height: 0;
		margin: 0;
	}

	& > span {
		position: absolute;
		display: inline-block;
		height: ${TOGGLE_SIZE};
		width: ${TOGGLE_SIZE};
		background: white;
		border-radius: 50%;
		left: 0;
		top: 0;
		transition: transform 0.3s ease-in-out;
		transform: translate(${DELTA}, ${DELTA});

		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 0;
			display: inline-flex;
			align-items: center;
			height: ${TOGGLE_SIZE};
			width: ${INNER_WIDTH};
			border-radius: ${TOGGLE_SIZE};
			line-height: 100%;
		}

		&::after {
			content: '☀️';
			text-align: right;
			font-size: 0.8em;
			left: 0;
			justify-content: flex-end;
			transform: translate(-3%, -5%);
		}

		&::before {
			content: '🌙';
			font-size: 0.7em;
			right: 0;
			justify-content: flex-start;
			transform: translate(3%, -5%);
		}
	}

	& input:checked + span {
		transform: translate(
			calc(${SWITCH_WIDTH} - ${TOGGLE_SIZE} - ${DELTA}),
			${DELTA}
		);
	}
`;

export function Header(this: PreactThis): VNode {
	const url = this.context.eleventy.page.url;

	return (
		<header class={main}>
			<div class="container">
				<a href="/" class={logo}>
					<span>F1</span>
					<span>Statistics</span>
				</a>
				<nav class={nav}>
					<a
						href="/seasons"
						class={cx(navLink, {
							[navLinkActive]: url.startsWith('/season'),
						})}
					>
						Seasons
					</a>
					<a
						href="/constructors"
						class={cx(navLink, {
							[navLinkActive]: url.startsWith('/constructors'),
						})}
					>
						Constructors
					</a>
					<a
						href="/drivers"
						class={cx(navLink, {
							[navLinkActive]: url.startsWith('/drivers'),
						})}
					>
						Drivers
					</a>
					<a
						href="/about"
						class={cx(navLink, { [navLinkActive]: url.startsWith('/about') })}
					>
						About
					</a>
					<label for="theme-toggle" class={themeToggle} title="Theme">
						<input id="theme-toggle" type="checkbox" />
						<span />
					</label>
				</nav>
			</div>
		</header>
	);
}
