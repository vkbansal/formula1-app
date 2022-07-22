export type ScaleLinear = (domainValue: number) => number;

export function scaleLinear(domain: [number, number], range: [number, number]): ScaleLinear {
	const [domainStart, domainEnd] = domain;
	const [rangeStart, rangeEnd] = range;
	const domainDiff = domainEnd - domainStart;
	const rangeDiff = rangeEnd - rangeStart;

	return (domainValue: number): number => {
		const diff = domainValue - domainStart;
		return rangeStart + (rangeDiff * diff) / domainDiff;
	};
}

export interface Band {
	start: number;
	end: number;
}

export interface ScaleBand<T> {
	(domainValue: T): Band;
	ticks: Band[];
	step: number;
}

export function scaleBand<T extends string | number>(
	domain: T[],
	range: [number, number],
): Readonly<ScaleBand<T>> {
	const [rangeStart, rangeEnd] = range;
	const step = (rangeEnd - rangeStart) / domain.length;
	const ticks = domain.reduce((p, c, i) => {
		p[c] = {
			start: rangeStart + i * step,
			end: rangeStart + (i + 1) * step,
		};

		return p;
	}, {} as Record<T, Band>);

	const ret: ScaleBand<T> = (domainValue: T) => {
		return ticks[domainValue];
	};

	ret.ticks = Object.values(ticks);
	ret.step = step;

	return ret;
}
