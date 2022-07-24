import { h, type VNode } from 'preact';
import { useEffect } from 'preact/hooks';
import cx from 'classnames';

export interface CharNavProps {
	currentSeason: number;
	disabledChars?: string[];
	active: string;
	allText?: string;
}

export const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function CharNav(props: CharNavProps): VNode {
	const { currentSeason, active, disabledChars = [], allText = 'All' } = props;

	useEffect(() => {
		if (disabledChars.includes(active)) {
			globalThis.location.hash = '';
		}
	}, [active, disabledChars]);

	return (
		<div class="char-nav">
			<a
				class={cx('nav-link', {
					'nav-link-active': active === '',
				})}
				href="#"
			>
				{currentSeason}
			</a>
			<div class="char-nav-chars">
				{CHARS.map((char) => {
					const disabled = disabledChars.includes(char);

					return (
						<a
							class={cx('nav-link', {
								'nav-link-active': active === char,
							})}
							disabled={disabled ? true : undefined}
							href={disabled ? 'javascript:void(0)' : `#${char}`}
						>
							{char}
						</a>
					);
				})}
			</div>
			<a
				class={cx('nav-link', {
					'nav-link-active': active === '@',
				})}
				href="#@"
			>
				{allText}
			</a>
		</div>
	);
}
