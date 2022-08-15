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
FROM `constructors` AS `C`
LEFT OUTER JOIN `results` AS `RE` USING (`constructorId`)
LEFT OUTER JOIN `races` AS `RA` USING (`raceId`)
WHERE `C`.`constructorId` = :constructorId
GROUP BY `RA`.`year`
ORDER BY `RA`.`year` ASC
