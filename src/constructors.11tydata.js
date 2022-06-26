const path = require('node:path');
const loadYamlFromDir = require('./_utils/loadYamlFromDir');

module.exports = async () => {
  const constructors = loadYamlFromDir(
    path.resolve(__dirname, `../data/constructors`)
  );

  return { constructors: Object.values(constructors) };
};
