import { h, toChildArray } from 'preact';
import type { VNode, ComponentChildren, RenderableProps, FunctionComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import cx from 'classnames';
import { normalize } from 'helpers/utils';

export interface TableColumnProps<T, U = never> {
	id: string;
	title: ComponentChildren;
	align?: 'left' | 'right' | 'center';
	render: keyof T | FunctionComponent<U extends never ? T : T & U>;
	sortBy?: keyof T;
	sorter?(a: T, b: T, sortAsc: boolean): number;
	extraProps?: U;
}

export interface TableProps<T> {
	data: T[];
	rowId: keyof T | ((row: T) => string);
	fixedLayout?: boolean;
	stickyHeader?: boolean | string;
	small?: boolean;
	children: VNode<TableColumnProps<T>>[];
}

export function Table<T>(props: TableProps<T>): VNode {
	const {
		data = [],
		fixedLayout,
		stickyHeader,
		small,
		rowId: _getRowId,
		children: _children,
	} = props;

	const [sortedData, setSortedData] = useState(data.slice(0));
	const [sortCol, setSortCol] = useState<string | null>(null);
	const [sortAsc, setSortAsc] = useState(false);

	const children = toChildArray(_children).filter(
		(c) => (c as VNode).type === TableColumn,
	) as VNode<TableColumnProps<T>>[];

	const getRowId =
		typeof _getRowId === 'function'
			? _getRowId
			: (row: T): ComponentChildren => row[_getRowId] as unknown as ComponentChildren;

	function handleSort(colToSort: TableColumnProps<T>): void {
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
		const colToSort = children.find((c) => c.props.id === sortCol);

		if (!colToSort) {
			return;
		}

		const sorter =
			typeof colToSort.props.sortBy === 'string' ? colToSort.props.sortBy : colToSort.props.sorter;

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
			copy.sort((a, b) => sorter(a, b, sortAsc));
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
				'table-sticky-header': stickyHeader,
				'table-sm': small,
			})}
		>
			<thead style={typeof stickyHeader === 'string' ? { top: stickyHeader } : undefined}>
				<tr>
					{children.map((col, i) => {
						const enableSort = !!(col.props.sortBy || col.props.sorter);
						return (
							<th
								key={`${col.props.id}_${i}`}
								class={cx({
									'sortable-column': enableSort,
									'text-right': col.props.align === 'right',
									'text-center': col.props.align === 'center',
								})}
								aria-sort={
									sortCol === col.props.id ? (sortAsc ? 'ascending' : 'descending') : undefined
								}
							>
								{enableSort ? (
									<button
										type="button"
										class="sort-btn"
										onClick={(): void => handleSort(col.props)}
									>
										<span>{col.props.title}</span>
										<span aria-hidden="true" class="sort-indicator" />
									</button>
								) : (
									col.props.title
								)}
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{sortedData.map((row, i) => {
					const rowId = getRowId(row);

					return (
						<tr key={`${rowId}_${i}`}>
							{children.map((col, j) => {
								const rowChild =
									typeof col.props.render === 'function'
										? h(col.props.render, {
												...row,
												...((col.props.extraProps || {}) as object),
										  } as any)
										: row[col.props.render];

								return (
									<td
										key={`${rowId}_${col.props.id}_${i}_${j}`}
										class={cx({
											'text-right': col.props.align === 'right',
											'text-center': col.props.align === 'center',
										})}
									>
										{rowChild as ComponentChildren}
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

function TableColumn<T, U = never>(props: RenderableProps<TableColumnProps<T, U>>): VNode {
	return <div>{props.children}</div>;
}

Table.Column = TableColumn;
