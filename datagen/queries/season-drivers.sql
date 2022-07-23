SELECT
	`driverRef`,
	CONCAT(`forename`, " ",`surname`) AS `name`,
	`nationality`
FROM
	`drivers`
WHERE `driverRef`
IN (
	SELECT DISTINCT `D`.`driverRef`
	FROM `results` AS `RE`
	LEFT OUTER JOIN `races` AS `DR`
	ON `RE`.`raceId` = `DR`.`raceId`
	LEFT OUTER JOIN `drivers` AS `D`
	ON `D`.`driverId` = `RE`.`driverId`
	WHERE `DR`.`year` = :year
)
ORDER BY `name` ASC;
