const START_YEAR = 1950;
const END_YEAR = 2022;

module.exports = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, i) => END_YEAR - i
);
