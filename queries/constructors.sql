-- path: constructors/:constructorRef.json
-- meta: {pickFirst: true}
-- params:query:start
SELECT `constructorRef` FROM `constructors`;
-- params:query:end

-- main:query:start
SELECT
  `C`.`constructorRef`,
  `C`.`name` AS `name`,
  `C`.`nationality`,
  COUNT(DISTINCT `R`.`raceId`) AS `totalRaces`,
  CAST(SUM(CASE WHEN `R`.`position` = 1 THEN 1 ELSE 0 END) AS INT) AS `raceWins`,
  CAST(SUM(CASE WHEN `R`.`position` <= 3 THEN 1 ELSE 0 END) AS INT) AS `podiums`
FROM `constructors` AS `C`
LEFT OUTER JOIN `results` AS `R` USING (`constructorId`)
WHERE `C`.`constructorRef` = :constructorRef
-- main:query:end
