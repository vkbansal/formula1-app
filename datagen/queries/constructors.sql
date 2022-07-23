SELECT
	`T`.`constructorRef`,
	`T`.`name`,
	`T`.`nationality`,
	`T`.`totalRaces`,
	`T`.`raceWins`,
	`T`.`podiums`,
	CAST(
		IF(`T`.`totalRaces` = 0, 0, `T`.`raceWins` * 100 / `T`.`totalRaces`) AS FLOAT
	) AS `winPct`,
	IF(
		COUNT(`DC`.`year`) = 0,
		JSON_ARRAY(),
		JSON_ARRAYAGG(
			JSON_OBJECT(
				'year', `DC`.`year`,
				'position', `DC`.`position`
			) ORDER BY `DC`.`year` ASC
		)
	) AS `championshipStandings`
FROM (
	SELECT
		`C`.`constructorId`,
		`C`.`constructorRef`,
		`C`.`name`,
		`C`.`nationality`,
		COUNT(DISTINCT `R`.`raceId`) AS `totalRaces`,
		CAST(SUM(IF(`R`.`position` = 1, 1, 0)) AS INT) AS `raceWins`,
		CAST(SUM(IF(`R`.`position` <= 3, 1, 0)) AS INT) AS `podiums`
	FROM `constructors` AS `C`
	LEFT OUTER JOIN `results` AS `R` USING (`constructorId`)
	GROUP BY `C`.`constructorId`
) AS T
LEFT OUTER JOIN `constructorChampionships` AS `DC` USING (`constructorId`)
GROUP BY `T`.`constructorId`
ORDER BY `T`.`name`
