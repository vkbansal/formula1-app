const path = require('node:path');
const loadYaml = require('./loadYaml');

module.exports = async (folder, pick = []) => {
  const { globby } = await import('globby');

  const files =
    pick.length > 0
      ? pick.map((file) => `${folder}/${file}.yaml`)
      : await globby([`${folder}/*.yaml`]);

  const data = {};

  for (const file of files) {
    const key = path.basename(file).replace(path.extname(file), '');
    const value = await loadYaml(file);

    data[key] = value;
  }

  return data;
};
