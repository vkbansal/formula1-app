SELECT
	`C`.`constructorRef`,
	`C`.`name`,
	`C`.`nationality`,
	JSON_ARRAYAGG(
		JSON_OBJECT(
			"driverRef", `D`.`driverRef`,
			"name", CONCAT(`D`.`forename`, " ",`D`.`surname`),
			"nationality", `D`.`nationality`
		) ORDER BY `D`.`forename`, `D`.`surname` ASC
	) AS `drivers`
FROM `teams` AS `T`
LEFT OUTER JOIN `constructors` AS `C` USING (`constructorId`)
LEFT OUTER JOIN `drivers` AS `D` USING (`driverId`)
WHERE `T`.`year` = :year
GROUP BY `C`.`constructorRef`
ORDER BY `C`.`name`  ASC;


