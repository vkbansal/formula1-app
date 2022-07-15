import { h, type VNode } from 'preact';
import cx from 'classnames';

export interface NationalityProps {
	nationality: string;
}

export function Nationality(props: NationalityProps): VNode {
	return (
		<span
			class={cx(
				'nationality',
				props.nationality.normalize('NFD').toLowerCase(),
			)}
		/>
	);
}
