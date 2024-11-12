import get from 'just-safe-get';

import { createIndexMap } from '../utils';
import { BaseData } from './BaseData';

export interface F1Constructor {
	readonly constructorId: number;
	readonly constructorRef: string;
	readonly name: string;
	readonly nationality: string;
	readonly url: string;
}

export class Constructors extends BaseData<F1Constructor> {
	override filename = 'constructors.csv';

	private constructorIdToIndexMap: Record<number, number>;

	constructor() {
		super();
		this.loadData();
		this.constructorIdToIndexMap = createIndexMap(this.data, 'constructorId');
	}

	getConstructorByConstructorId(
		constructorId: number,
	): F1Constructor | undefined {
		return get(
			this.data,
			String(get(this.constructorIdToIndexMap, String(constructorId))),
		);
	}

	getConstructorRefByConstructorId(constructorId: number): string {
		return get(
			this.getConstructorByConstructorId(constructorId)!,
			'constructorRef',
			'',
		);
	}
}
