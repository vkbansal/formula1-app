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
	mid: number;
	end: number;
}

export interface ScaleBand<T> {
	(domainValue: T): Band;
	ticks(): Band[];
	step(): number;
}

export function scaleBand<T extends string | number>(
	domain: T[],
	range: [number, number],
): ScaleBand<T> {
	const [rangeStart, rangeEnd] = range;
	const step = (rangeEnd - rangeStart) / domain.length;
	const ticksMap = domain.reduce((p, c, i) => {
		const start = rangeStart + i * step;
		p[c] = {
			start,
			mid: start + step / 2,
			end: start + step,
		};

		return p;
	}, {} as Record<T, Band>);
	const ticks: Band[] = Object.values(ticksMap);

	const ret: ScaleBand<T> = (domainValue: T) => {
		return ticksMap[domainValue];
	};

	ret.ticks = (): Band[] => ticks;
	ret.step = (): number => step;

	return ret;
}
