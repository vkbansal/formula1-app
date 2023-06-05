SELECT
	`RA`.`year`,
	JSON_ARRAYAGG(
		JSON_OBJECT(
			'round', `RA`.`round`,
			'roundName', `RA`.`name`,
			'constructor', `C`.`name`,
			'position', `RE`.`position`,
			'points', `RE`.`points`
		) ORDER BY `RA`.`round` ASC
	) AS `results`
FROM `drivers` AS `D`
LEFT OUTER JOIN `results` AS `RE` USING (`driverId`)
LEFT OUTER JOIN `races` AS `RA` USING (`raceId`)
LEFT OUTER JOIN `constructors` AS `C` USING (`constructorId`)
WHERE `D`.`driverId` = :driverId
GROUP BY `RA`.`year`
ORDER BY `RA`.`year` ASC
