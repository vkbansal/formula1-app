const vm = require('node:vm');
const { h, Fragment } = require('preact');

function isPlainObject(obj) {
	return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

module.exports.isPlainObject = isPlainObject;

module.exports.vmContext = vm.createContext({
	module,
	require,
	h,
	Fragment,
	process,
	console,
	URL,
	setImmediate,
	setInterval,
	setTimeout
});
