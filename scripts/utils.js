function isPlainObject(obj) {
	return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

module.exports.isPlainObject = isPlainObject;
