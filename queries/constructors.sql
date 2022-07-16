-- path: constructors/:constructorRef.json
-- meta: {pickFirst: true}
-- params:query:start
SELECT `constructorRef` FROM `constructors`;
-- params:query:end

-- main:query:start
SELECT
	`T`.*
,	CAST(
		IF(`T`.`totalRaces` = 0, 0, `T`.`raceWins` * 100 / `T`.`totalRaces`) AS FLOAT
	) AS winPct
,	JSON_ARRAYAGG(
		JSON_OBJECT(
			'year', `DC`.`year`,
			'position', `DC`.`position`
		) ORDER BY `DC`.`year` ASC
	) AS `championshipStandings`
FROM (
	SELECT
		`C`.`constructorId`
	,	`C`.`constructorRef`
	, `C`.`name` AS `name`
	,	`C`.`nationality`
	,	COUNT(DISTINCT `R`.`raceId`) AS `totalRaces`
	,	CAST(SUM(IF(`R`.`position` = 1, 1, 0)) AS INT) AS `raceWins`
	,	CAST(SUM(IF(`R`.`position` <= 3, 1, 0)) AS INT) AS `podiums`
	FROM `constructors` AS `C`
	LEFT OUTER JOIN `results` AS `R` USING (`constructorId`)
	WHERE `C`.`constructorRef` = :constructorRef
) AS T
LEFT OUTER JOIN `constructorChampionships` AS `DC` USING (`constructorId`)
-- main:query:end
