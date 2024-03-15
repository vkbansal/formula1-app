import get from 'just-safe-get';
import { BaseData } from './BaseData';
import { createIndexMap } from '../utils';

export interface ICircuit {
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

export class Circuits extends BaseData<ICircuit> {
	protected override filename = 'circuits.csv';

	private circuitIdToCircuitIndexMap: Record<number, number> = {};

	constructor() {
		super();

		this.loadData();

		this.circuitIdToCircuitIndexMap = createIndexMap(this.data, 'circuitId');
	}

	getCircuitByCircuitId(circuitId: number): ICircuit | undefined {
		return get(
			this.data,
			String(get(this.circuitIdToCircuitIndexMap, String(circuitId))),
		);
	}
}
