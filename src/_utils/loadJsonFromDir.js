const path = require('node:path');

module.exports = async (folder, pick = []) => {
  const { globby } = await import('globby');

  const files =
    pick.length > 0
      ? pick.map((file) => `${folder}/${file}.json`)
      : await globby([`${folder}/*.json`]);

  const data = {};

  for (const file of files) {
    const key = path.basename(file).replace(path.extname(file), '');
    const value = require(file);

    data[key] = value;
  }

  return data;
};
