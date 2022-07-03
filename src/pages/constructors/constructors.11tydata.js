const path = require('node:path');
const loadJsonFromDir = require('../../_utils/loadJsonFromDir');

module.exports = async () => {
  const constructors = await loadJsonFromDir(
    path.resolve(process.cwd(), `data/constructors`)
  );

  return { constructors: Object.values(constructors) };
};
