SELECT
	`constructorRef`,
	`name`,
	`nationality`
FROM
	`constructors`
WHERE `constructorRef` IN (
	SELECT DISTINCT `C`.`constructorRef`
	FROM `results` AS `RE`
	LEFT OUTER JOIN `races` AS `R`
	ON `RE`.`raceId` = `R`.`raceId`
	LEFT OUTER JOIN `constructors` AS `C`
	ON `C`.`constructorId` = `RE`.`constructorId`
	WHERE `R`.`year` = :year
)
ORDER BY `name`  ASC;
