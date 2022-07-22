import { h, type VNode, type ComponentChildren } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import cx from 'classnames';
import { normalize } from 'helpers/utils';

export interface BaseTableColumn {
	id: string;
	title: ComponentChildren;
	align?: 'left' | 'right' | 'center';
}

export interface TableColumn<T> extends BaseTableColumn {
	data: keyof T | ((row: T) => ComponentChildren);
}

export interface SimpleSortableTableColumn<T> extends BaseTableColumn {
	data: keyof T;
}

export interface SortableTableColumnWithSorter<T> extends BaseTableColumn {
	data: (row: T) => ComponentChildren;
	sorter: keyof T | ((a: T, b: T) => 1 | -1 | 0);
}

export type SortableTableColumn<T> =
	| SimpleSortableTableColumn<T>
	| SortableTableColumnWithSorter<T>;

export interface BaseTableProps<T> {
	data: T[];
	rowId: keyof T | ((row: T) => string);
	sortable?: boolean;
	fixedLayout?: boolean;
	stickyHeader?: boolean | string;
	small?: boolean;
}

export interface TableProps<T> extends BaseTableProps<T> {
	columns: TableColumn<T>[];
	sortable?: false;
}

export interface SortableTableProps<T> extends BaseTableProps<T> {
	columns: SortableTableColumn<T>[];
	sortable: true;
}

export function Table<T>(props: TableProps<T> | SortableTableProps<T>): VNode {
	const {
		columns,
		data = [],
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
			: (row: T): ComponentChildren => row[_getRowId] as unknown as ComponentChildren;

	function handleSort(colToSort: SortableTableColumn<T>): void {
		if (!colToSort) {
			return;
		}

		if (sortCol === colToSort.id) {
			setSortAsc(!sortAsc);
		} else {
			setSortCol(colToSort.id);
			setSortAsc(false);
		}
	}

	useEffect(() => {
		const colToSort = columns.find((c) => c.id === sortCol);

		if (!colToSort) {
			return;
		}

		const sorter =
			typeof colToSort.data === 'string'
				? (colToSort as SimpleSortableTableColumn<T>).data
				: (colToSort as SortableTableColumnWithSorter<T>).sorter;

		const copy = data.slice(0);

		if (typeof sorter === 'string') {
			copy.sort((a, b) => {
				if (normalize(a[sorter]) < normalize(b[sorter])) {
					return sortAsc ? -1 : 1;
				}

				if (normalize(a[sorter]) > normalize(b[sorter])) {
					return sortAsc ? 1 : -1;
				}

				return 0;
			});
		} else if (typeof sorter === 'function') {
			copy.sort(sorter);
		}

		setSortedData(copy);
	}, [sortAsc, sortCol]);

	useEffect(() => {
		setSortAsc(false);
		setSortCol(null);
		setSortedData(data.slice(0));
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
			<thead style={typeof stickyHeader === 'string' ? { top: stickyHeader } : undefined}>
				<tr>
					{columns.map((col) => {
						return (
							<th
								key={col.id}
								aria-sort={sortCol === col.id ? (sortAsc ? 'ascending' : 'descending') : undefined}
							>
								{sortable ? (
									<button
										type="button"
										class="sort-btn"
										onClick={(): void => handleSort(col as SortableTableColumn<T>)}
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
								const data = typeof col.data === 'function' ? col.data(row) : row[col.data];

								return (
									<td
										key={`${rowId}_${col.id}`}
										class={cx({
											'text-right': col.align === 'right',
											'text-center': col.align === 'center',
										})}
									>
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
