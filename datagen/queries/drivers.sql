SELECT
	`D`.`driverId`,
	`D`.`driverRef`,
	CONCAT(`D`.`forename`, " ",`D`.`surname`) AS `name`,
	`D`.`dob`,
	`D`.`nationality`,
	false as `hasImage`,
	`R`.`totalRaces`,
	`R`.`raceWins`,
	`R`.`podiums`,
	`L`.`totalLaps`,
	`L`.`lapsLead`,
	IF(`DC`.`championshipStandings` IS NULL, JSON_ARRAY(), `DC`.`championshipStandings`) AS `championshipStandings`
FROM `drivers` AS `D`
LEFT OUTER JOIN (
	SELECT
		`driverId`,
		COUNT(DISTINCT `raceId`) AS `totalRaces`,
		CAST(SUM(IF(`position` = 1, 1, 0)) AS INT) AS `raceWins`,
		CAST(SUM(IF(`position` <= 3, 1, 0)) AS INT) AS `podiums`
	FROM `results`
	GROUP BY `driverId`
) AS `R` USING (`driverId`)
LEFT OUTER JOIN (
	SELECT
	`driverId`,
	IF(
		COUNT(`year`) = 0,
		JSON_ARRAY(),
		JSON_ARRAYAGG(
			JSON_OBJECT(
				'year', `year`,
				'position', `position`
			) ORDER BY `year` ASC
		)
	) AS `championshipStandings`
	FROM `driverChampionships`
	GROUP BY `driverId`
) AS `DC` USING (`driverId`)
LEFT OUTER JOIN (
	SELECT
	`driverId`,
	COUNT(*) AS `totalLaps`,
	CAST(SUM(IF(`position` = 1, 1, 0)) AS INT) AS `lapsLead`
	FROM `lapTimes`
	GROUP BY `driverId`
) AS `L` USING (`driverId`)
GROUP BY `D`.`driverId`
ORDER BY `name` ASC
