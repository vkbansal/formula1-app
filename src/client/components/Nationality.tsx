import { h } from 'preact';
import cx from 'classnames';
import { css } from '@emotion/css';

export interface NationalityProps {
	nationality: string;
}

export function Nationality(props: NationalityProps) {
	return (
		<span
			class={cx(
				'nationality',
				props.nationality.normalize('NFD').toLowerCase(),
			)}
		/>
	);
}
