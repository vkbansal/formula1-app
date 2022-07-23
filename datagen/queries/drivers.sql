-- path: drivers/:driverRef.json
-- meta: {pickFirst: true}
-- params:query:start
SELECT `driverRef` FROM `drivers`;
-- params:query:end

-- main:query:start
SELECT
	`T`.*
,	CAST(
		CASE
			WHEN `T`.`totalRaces` = 0
			THEN 0
			ELSE `T`.`raceWins` * 100 / `T`.`totalRaces`
		END
	AS FLOAT) AS winPct
,	JSON_ARRAYAGG(
		JSON_OBJECT(
			'year', `DC`.`year`,
			'position', `DC`.`position`
		) ORDER BY `DC`.`year` ASC
	) AS `championshipStandings`
FROM (
	SELECT
		`D`.`driverId`
	,	`D`.`driverRef`
	,	CONCAT(`D`.`forename`, " ",`D`.`surname`) AS `name`
	,	`D`.`dob`
	,	`D`.`nationality`
	,	COUNT(*) AS `totalRaces`
	,	CAST(SUM(IF(`RE`.`position` = 1, 1, 0)) AS INT) AS `raceWins`
	,	CAST(SUM(IF(`RE`.`position` <= 3, 1, 0)) AS INT) AS `podiums`
	FROM `drivers` AS `D`
	LEFT OUTER JOIN `results` AS `RE` USING (`driverId`)
	WHERE `D`.`driverRef` = :driverRef
	GROUP BY `D`.`driverId`
) AS T
LEFT OUTER JOIN `driverChampionships` AS `DC` USING (`driverId`)
-- main:query:end
