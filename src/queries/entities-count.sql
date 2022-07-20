SELECT
  (SELECT COUNT(*) FROM `seasons`) AS `seasons`,
  (SELECT COUNT(*) FROM `drivers`) AS `drivers`,
  (SELECT COUNT(*) FROM `constructors`) AS `constructors`,
  (SELECT COUNT(*) FROM `circuits`) AS `circuits`,
  (SELECT COUNT(DISTINCT `raceId`) FROM `results`) AS `races`;
