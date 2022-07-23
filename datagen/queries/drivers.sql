SELECT
	`T`.`driverRef`,
	`T`.`name`,
	`T`.`dob`,
	`T`.`nationality`,
	`T`.`raceWins`,
	`T`.`totalRaces`,
	`T`.`podiums`,
	CAST(
		IF(`T`.`totalRaces` = 0, 0, `T`.`raceWins` * 100 / `T`.`totalRaces`) AS FLOAT
	) AS `winPct`,
	IF(
		COUNT(`DC`.`year`) = 0,
		JSON_ARRAY(),
		JSON_ARRAYAGG(
			JSON_OBJECT(
				'year', `DC`.`year`,
				'position', `DC`.`position`
			) ORDER BY `DC`.`year` ASC
		)
	) AS `championshipStandings`
FROM (
	SELECT
		`D`.`driverId`,
		`D`.`driverRef`,
		CONCAT(`D`.`forename`, " ",`D`.`surname`) AS `name`,
		`D`.`dob`,
		`D`.`nationality`,
		COUNT(*) AS `totalRaces`,
		CAST(SUM(IF(`RE`.`position` = 1, 1, 0)) AS INT) AS `raceWins`,
		CAST(SUM(IF(`RE`.`position` <= 3, 1, 0)) AS INT) AS `podiums`
	FROM `drivers` AS `D`
	LEFT OUTER JOIN `results` AS `RE` USING (`driverId`)
	GROUP BY `D`.`driverId`
) AS T
LEFT OUTER JOIN `driverChampionships` AS `DC` USING (`driverId`)
GROUP BY `T`.`driverId`
ORDER BY `T`.`name`
