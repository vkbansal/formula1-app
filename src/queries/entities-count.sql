SELECT
  (SELECT COUNT(*) FROM `seasons`) AS `seasons`,
  (SELECT COUNT(*) FROM `drivers`) AS `drivers`,
  (SELECT COUNT(DISTINCT `nationality`) FROM `drivers`) AS `driverNationalities`,
  (SELECT COUNT(*) FROM `constructors`) AS `constructors`,
  (SELECT COUNT(DISTINCT `nationality`) FROM `constructors`) AS `constructorNationalities`,
  (SELECT COUNT(*) FROM `circuits`) AS `circuits`,
  (SELECT COUNT(DISTINCT `country`) FROM `circuits`) AS `circuitCountries`,
  (SELECT COUNT(DISTINCT `raceId`) FROM `results`) AS `races`;
