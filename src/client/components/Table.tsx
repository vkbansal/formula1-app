import { h, type VNode, type ComponentChildren } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import cx from 'classnames';

export interface TableColumn<T> {
	id: string;
	title: ComponentChildren;
	data: keyof T | ((row: T) => ComponentChildren);
}

export interface TableProps<T> {
	data: T[];
	columns: TableColumn<T>[];
	rowId: keyof T | ((row: T) => string);
	sortable?: boolean;
	fixedLayout?: boolean;
	stickyHeader?: boolean;
	small?: boolean;
}

export function Table<T>(props: TableProps<T>): VNode {
	const {
		columns,
		data,
		sortable,
		fixedLayout,
		stickyHeader,
		small,
		rowId: _getRowId,
	} = props;

	const [sortedData, setSortedData] = useState(data.slice(0));
	const [sortCol, setSortCol] = useState<string | null>(null);
	const [sortAsc, setSortAsc] = useState(false);

	const getRowId =
		typeof _getRowId === 'function'
			? _getRowId
			: (row: T): ComponentChildren =>
					row[_getRowId] as unknown as ComponentChildren;

	function handleSort(col: string): void {
		if (sortCol === col) {
			setSortAsc(!setSortAsc);
		} else {
			setSortCol(col);
			setSortAsc(false);
		}
	}

	useEffect(() => {
		// sorting logic
	}, [sortAsc, setSortCol]);

	useEffect(() => {
		setSortedData(data);
	}, [data]);

	return (
		<table
			class={cx('table', {
				'table-fixed': fixedLayout,
				'table-sortable': sortable,
				'table-sticky-header': stickyHeader,
				'table-sm': small,
			})}
		>
			<thead>
				<tr>
					{columns.map((col) => {
						return (
							<th
								key={col.id}
								aria-sort={
									sortCol === col.id
										? sortAsc
											? 'ascending'
											: 'descending'
										: undefined
								}
							>
								{sortable ? (
									<button
										class="sort-btn"
										onClick={(): void => handleSort(col.id)}
									>
										<span>{col.title}</span>
										<span aria-hidden="true" class="sort-indicator" />
									</button>
								) : (
									col.title
								)}
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{sortedData.map((row) => {
					const rowId = getRowId(row);
					return (
						<tr key={rowId}>
							{columns.map((col) => {
								const data =
									typeof col.data === 'function'
										? col.data(row)
										: row[col.data];

								return (
									<td key={`${rowId}_${col.id}`}>
										{data as ComponentChildren}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
