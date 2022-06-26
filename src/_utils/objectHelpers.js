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

module.exports.pick = (obj, keys) => {
  return keys.reduce((og, key) => ({ ...og, [key]: obj[key] }), {});
};
