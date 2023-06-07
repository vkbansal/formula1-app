SELECT
	`S`.`year`,
	COUNT(`R`.`raceId`) AS `totalRaces`
FROM `seasons` AS `S`
LEFT OUTER JOIN `races` AS `R` USING (`year`)
GROUP BY `S`.`year`
ORDER BY `year` DESC
