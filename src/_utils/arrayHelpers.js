module.exports.groupBy = (arr, group) => {
	const getGroupByValue =
		typeof group === 'function'
			? group
			: typeof group === 'string'
			? (row) => row[group]
			: null;

	if (getGroupByValue === null) {
		return {};
	}

	return arr.reduce((obj, row) => {
		const groupByValue = getGroupByValue(row);

		if (!Array.isArray(obj[groupByValue])) {
			obj[groupByValue] = [];
		}

		obj[groupByValue].push(row);

		return obj;
	}, {});
};
