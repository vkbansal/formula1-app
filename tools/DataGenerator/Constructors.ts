import get from 'just-safe-get';

import { BaseData } from './BaseData';
import { createIndexMap } from '../utils';

export interface IConstructor {
	readonly constructorId: number;
	readonly constructorRef: string;
	readonly name: string;
	readonly nationality: string;
	readonly url: string;
}

export class Constructors extends BaseData<IConstructor> {
	override filename = 'constructors.csv';

	private constructorIdToIndexMap: Record<number, number>;

	constructor() {
		super();
		this.loadData();
		this.constructorIdToIndexMap = createIndexMap(this.data, 'constructorId');
	}

	getConstructorByConstructorId(
		constructorId: number,
	): IConstructor | undefined {
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
