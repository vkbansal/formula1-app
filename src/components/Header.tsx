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
				</nav>
			</div>
		</header>
	);
}
