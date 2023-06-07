SELECT
	`RA`.`raceId`,
	`RA`.`year`,
	`RA`.`round`,
	`RA`.`name`,
	`RA`.`date`,
	'' AS `slug`,
	JSON_OBJECT(
		"name", `CI`.`name`,
		"location", `CI`.`location`,
		"country", `CI`.`country`,
		"circuitRef", `CI`.`circuitRef`
	) AS `circuit`,
	IF(
		COUNT(`RE`.`resultId`) = 0,
		JSON_ARRAY(),
		JSON_ARRAYAGG(
			JSON_OBJECT(
				"driverRef", `DR`.`driverRef`,
				"constructorRef", `CO`.`constructorRef`,
				"grid", `RE`.`grid`,
				"position", `RE`.`position`,
				"positionText", `RE`.`positionText`,
				"positionOrder", `RE`.`positionOrder`,
				"points", `RE`.`points`
			) ORDER BY `RE`.`positionOrder` ASC
		)
	) AS `driversData`
FROM
	`races` AS `RA`
LEFT OUTER JOIN `results` AS `RE` USING (`raceId`)
LEFT OUTER JOIN `circuits` AS `CI` USING (`circuitId`)
LEFT OUTER JOIN `drivers` AS `DR` USING (`driverId`)
LEFT OUTER JOIN `constructors` AS `CO` USING (`constructorId`)
GROUP BY `RA`.`raceId`
ORDER BY `RA`.`year` ASC, `RA`.`round` ASC
