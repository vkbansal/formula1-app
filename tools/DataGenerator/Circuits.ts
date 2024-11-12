import get from 'just-safe-get';

import { createIndexMap } from '../utils';
import { BaseData } from './BaseData';

export interface Circuit {
	readonly circuitId: number;
	readonly circuitRef: string;
	readonly name: string;
	readonly location: string;
	readonly country: string;
	readonly lat: number;
	readonly lng: number;
	readonly alt: number;
	readonly url: string;
}

export class Circuits extends BaseData<Circuit> {
	protected override filename = 'circuits.csv';

	private circuitIdToCircuitIndexMap: Record<number, number> = {};

	constructor() {
		super();

		this.loadData();

		this.circuitIdToCircuitIndexMap = createIndexMap(this.data, 'circuitId');
	}

	getCircuitByCircuitId(circuitId: number): Circuit | undefined {
		return get(
			this.data,
			String(get(this.circuitIdToCircuitIndexMap, String(circuitId))),
		);
	}
}
