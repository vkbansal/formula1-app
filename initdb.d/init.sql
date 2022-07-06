CREATE TABLE `driverChampionships` AS (
	SELECT
		`FR`.`year` AS `year`,
		`R`.`raceId` AS `raceId`,
		`DS`.`driverId` AS `driverId`,
		`DS`.`position` AS `position`
	FROM (
		SELECT
			MAX(`R`.`round`) AS `round`,
			`R`.`year` AS `year`
		FROM `races` AS `R`
		GROUP BY `R`.`year`
	) AS `FR`
	LEFT OUTER JOIN `races` AS `R` USING (`round`, `year`)
	LEFT OUTER JOIN `driverStandings` AS DS USING (`raceId`)
);

CREATE TABLE `constructorChampionships` AS (
	SELECT
		`FR`.`year` AS `year`,
		`R`.`raceId` AS `raceId`,
		`CS`.`constructorId` AS `constructorId`,
		`CS`.`position` AS `position`
	FROM (
		SELECT
			MAX(`R`.`round`) AS `round`,
			`R`.`year` AS `year`
		FROM `races` AS `R`
		GROUP BY `R`.`year`
	) AS `FR`
	LEFT OUTER JOIN `races` AS `R` USING (`round`, `year`)
	LEFT OUTER JOIN `constructorStandings` AS CS USING (`raceId`)
);
