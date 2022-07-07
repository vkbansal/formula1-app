function pick(obj, keys) {
	return keys.reduce((og, key) => ({ ...og, [key]: obj[key] }), {});
}

function omit(obj, keys) {
	const objKeys = new Set(Object.keys(obj));

	keys.forEach((key) => objKeys.delete(key));

	return pick(obj, [...objKeys]);
}
module.exports.mapKeys = (obj, fn) => {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [fn(key, value, obj), value])
	);
};

module.exports.mapValues = (obj, fn) => {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [key, fn(key, value, obj)])
	);
};

module.exports.pick = pick;

module.exports.omit = omit;
