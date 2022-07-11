-- path: seasons/:year/constructors.json
-- meta: {pickFirst: false}
-- params:query:start
SELECT `year` FROM `seasons`;
-- params:query:end

-- main:query:start
SELECT DISTINCT `C`.`constructorRef`
FROM `results` AS `RE`
LEFT OUTER JOIN `races` AS `DR`
ON `RE`.`raceId` = `DR`.`raceId`
LEFT OUTER JOIN `constructors` AS `C`
ON `C`.`constructorId` = `RE`.`constructorId`
WHERE `DR`.`year` = :year
ORDER BY `C`.`constructorRef` ASC;
-- main:query:end
