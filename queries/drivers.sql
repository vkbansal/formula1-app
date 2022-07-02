-- path: drivers/:driverRef.json
-- meta: {pickFirst: true}
-- params:query:start
SELECT `driverRef` FROM `drivers`;
-- params:query:end

-- main:query:start
SELECT
   `D`.`driverRef`,
  CONCAT(`D`.`forename`, " ",`D`.`surname`) AS `name`,
   `D`.`dob`,
   `D`.`nationality`,
   COUNT(*) AS `totalRaces`,
   CAST(SUM(CASE WHEN `RE`.`position` = 1 THEN 1 ELSE 0 END) AS INT) AS `raceWins`,
   CAST(SUM(CASE WHEN `RE`.`position` <= 3 THEN 1 ELSE 0 END) AS INT) AS `podiums`
FROM `drivers` AS `D`
LEFT OUTER JOIN `results` AS `RE` USING (`driverId`)
WHERE `D`.`driverRef` = :driverRef
GROUP BY `D`.`driverId`
-- main:query:end
