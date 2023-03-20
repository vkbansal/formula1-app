SELECT
	`T2`.`raceId` AS `raceId`,
	`T2`.`driverId` AS `driverId`,
	`T2`.`driverRef` AS `driverRef`,
	`T2`.`lapPositions` AS `lapPositions`,
	`T2`.`pitStops` AS `pitStops`,
		JSON_OBJECT(
			"position", `Q`.`position`,
			"q1", `Q`.`q1`,
			"q2", `Q`.`q2`,
			"q3", `Q`.`q3`
		)
	 AS `qualifying`
FROM (
	SELECT
		`T1`.`raceId` AS `raceId`,
		`T1`.`driverId` AS `driverId`,
		`T1`.`driverRef` AS `driverRef`,
		`T1`.`lapPositions` AS `lapPositions`,
		IF(
			COUNT(`P`.`stop`) = 0,
			JSON_ARRAY(),
			JSON_ARRAYAGG(
				JSON_OBJECT(
					"stop", `P`.`stop`,
					"lap", `P`.`lap`
				) ORDER BY `P`.`stop` ASC
			)
		) AS `pitStops`
	FROM (
		SELECT
			`L`.`raceId` AS `raceId`,
			`D`.`driverId` AS `driverId`,
			`D`.`driverRef` AS `driverRef`,
			JSON_ARRAYAGG(`L`.`position` ORDER BY `L`.`lap` ASC) AS `lapPositions`
		FROM `lapTimes` AS `L`
		LEFT OUTER JOIN `drivers` AS `D` USING (`driverId`)
		WHERE `L`.`raceId` = :raceId
		GROUP BY `D`.`driverId`
	) AS `T1`
	LEFT OUTER JOIN `pitStops` AS `P` USING (`raceId`, `driverId`)
	GROUP BY `T1`.`driverId`
) AS `T2`
LEFT OUTER JOIN `qualifying` AS `Q` USING (`raceId`, `driverId`)
