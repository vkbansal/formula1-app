SELECT
	`T`.`year`,
	JSON_ARRAYAGG(
		JSON_OBJECT(
			'round', `T`.`round`,
			'roundName', `T`.`roundName`,
			'results', `T`.`results`
		) ORDER BY `T`.`round` ASC
	) AS `rounds`
FROM (
	SELECT
		`RA`.`year`,
		`RA`.`round`,
		`RA`.`name` AS `roundName`,
		JSON_ARRAYAGG(
			JSON_OBJECT(
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
	GROUP BY `RA`.`year`, `RA`.`round`
	) AS T
GROUP BY `T`.`year`
ORDER BY `T`.`year` ASC
