-- path: seasons/:year/drivers.json
-- meta: {pickFirst: false}
-- params:query:start
SELECT `year` FROM `seasons`;
-- params:query:end


-- main:query:start
SELECT DISTINCT `D`.`driverRef`
FROM `results` AS `RE`
LEFT OUTER JOIN `races` AS `DR`
ON `RE`.`raceId` = `DR`.`raceId`
LEFT OUTER JOIN `drivers` AS `D`
ON `D`.`driverId` = `RE`.`driverId`
WHERE
  `DR`.`year` = :year;
-- main:query:end
