SELECT
	`RA`.`year`,
	JSON_ARRAYAGG(
		JSON_OBJECT(
			'round', `RA`.`round`,
			'roundName', `RA`.`name`,
			'driver', CONCAT(`D`.`forename`, " ",`D`.`surname`),
			'position', `RE`.`position`,
			'points', `RE`.`points`
		) ORDER BY `RA`.`round` ASC
	) AS `results`
FROM `constructors` AS `C`
LEFT OUTER JOIN `results` AS `RE` USING (`constructorId`)
LEFT OUTER JOIN `races` AS `RA` USING (`raceId`)
LEFT OUTER JOIN `drivers` AS `D` USING (`driverId`)
WHERE `C`.`constructorId` = :constructorId
GROUP BY `RA`.`year`
ORDER BY `RA`.`year` ASC
