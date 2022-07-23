SELECT
  (SELECT COUNT(*) FROM `seasons`) AS `seasons`,
  (SELECT COUNT(*) FROM `drivers`) AS `drivers`,
  (SELECT COUNT(*) FROM `constructors`) AS `constructors`,
  (SELECT COUNT(*) FROM `circuits`) AS `circuits`,
  (SELECT COUNT(DISTINCT `raceId`) FROM `results`) AS `races`,
	(SELECT COUNT(DISTINCT `driverId`) FROM `driverChampionships` WHERE `position` = 1) AS `driverChampions`,
	(SELECT COUNT(DISTINCT `constructorId`) FROM `constructorChampionships` WHERE `position` = 1) AS `constructorChampions`;
