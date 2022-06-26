-- path: entities-count.json
-- meta: {pickFirst: true}
-- main:query:start
SELECT
  (SELECT COUNT(*) FROM `seasons`) AS `seasons`,
  (SELECT COUNT(*) FROM `drivers`) AS `drivers`,
  (SELECT COUNT(DISTINCT `nationality`) FROM `drivers`) AS `driverNationalities`,
  (SELECT COUNT(*) FROM `constructors`) AS `constructors`,
  (SELECT COUNT(DISTINCT `nationality`) FROM `constructors`) AS `constructorNationalities`,
  (SELECT COUNT(*) FROM `circuits`) AS `circuits`,
  (SELECT COUNT(DISTINCT `country`) FROM `circuits`) AS `circuitCountries`,
  (SELECT COUNT(*) FROM `races`) AS `races`;
-- main:query:end
