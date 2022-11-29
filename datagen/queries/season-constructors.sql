SELECT
	`T1`.`constructorRef`,
	`T1`.`name`,
	`T1`.`nationality`,
	JSON_ARRAYAGG(
		JSON_OBJECT(
			"driverRef", `T1`.`driverRef`,
			"name", `T1`.`driverName`,
			"nationality", `T1`.`driverNationality`
		) ORDER BY `T1`.`driverName` ASC
	) AS `drivers`
FROM (
	SELECT
		`C`.`constructorRef`,
		`C`.`name`,
		`C`.`nationality`,
		`D`.`driverRef`,
		CONCAT(`D`.`forename`, " ",`D`.`surname`) AS `driverName`,
		`D`.`nationality` as `driverNationality`
	FROM `results` AS `RE`
	LEFT OUTER JOIN `races` AS `R`
		ON `RE`.`raceId` = `R`.`raceId`
	LEFT OUTER JOIN `constructors` AS `C`
		ON `C`.`constructorId` = `RE`.`constructorId`
	LEFT OUTER JOIN `drivers` AS `D`
		ON `D`.`driverId` = `RE`.`driverId`
	WHERE `R`.`year` = :year
GROUP BY 		`C`.`constructorRef`, `D`.`driverRef`
) AS `T1`
GROUP BY `T1`.`constructorRef`
ORDER BY `T1`.`name`  ASC;


