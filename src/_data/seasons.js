module.exports = () => {
	const data = require('../../data/seasons.json');

	return data.map((row) => row.year);
};
