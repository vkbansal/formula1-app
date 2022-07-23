import { h, type VNode } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import cx from 'classnames';

export interface CharNavProps {
	onCharChange(char: string): void;
	currentSeason: number;
	disabledChars?: string[];
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function CharNav(props: CharNavProps): VNode {
	const { currentSeason, onCharChange, disabledChars = [] } = props;
	const [active, setActive] = useState(window.location.hash.slice(1, 2) || '');
	const ref = useRef<HTMLDivElement | null>(null);
	const onChangeRef = useRef<CharNavProps['onCharChange']>(() => void 0);

	const handleHashChange = useCallback(() => {
		const { hash } = window.location;

		setActive(hash ? hash.slice(1, 2) : '');
	}, []);

	const transformHighlight = useCallback((char: string) => {
		if (!ref.current || !ref.current.parentElement) {
			return;
		}

		const parent = ref.current.parentElement;
		const activeLink = parent.querySelector(`a[href="#${char}"]`);

		if (!activeLink) {
			return;
		}

		const parentRect = parent.getBoundingClientRect();
		const linkRect = activeLink.getBoundingClientRect();

		const dx = linkRect.left - parentRect.left;
		const scale = linkRect.width / 100;

		ref.current.setAttribute('style', `transform: translateX(${dx}px) scaleX(${scale})`);
	}, []);

	useEffect(() => {
		// run update with a delay on mount
		const timer = window.setTimeout(() => transformHighlight(active), 200);

		return () => {
			window.clearInterval(timer);
		};
	}, []);

	useEffect(() => {
		onChangeRef.current = onCharChange;
	}, [onCharChange]);

	useEffect(() => {
		onChangeRef.current(active);

		window.requestAnimationFrame(() => transformHighlight(active));
	}, [active]);

	useEffect(() => {
		window.addEventListener('hashchange', handleHashChange);

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	}, []);

	return (
		<div class="char-nav">
			<div ref={ref} class="char-nav-highlight" />
			<a
				class={cx('char-nav-link', {
					'char-nav-link-active': active === '',
				})}
				href="#"
			>
				{currentSeason}
			</a>
			<div class="char-nav-chars">
				{CHARS.map((char) => (
					<a
						class={cx('char-nav-link', {
							'char-nav-link-active': active === char,
						})}
						disabled={disabledChars.includes(char) ? true : undefined}
						href={`#${char}`}
					>
						{char}
					</a>
				))}
			</div>
		</div>
	);
}
