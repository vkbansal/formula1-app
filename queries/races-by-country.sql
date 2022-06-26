-- path: races-by-country.json
-- main:query:start
SELECT
  `C`.`country` AS `country`,
  COUNT(*) AS `count`
FROM (
  SELECT
    `RE`.`raceId` AS `raceId`,
    `RA`.`circuitId`
  FROM `results` as `RE`
  LEFT OUTER JOIN `races` AS `RA`
  ON `RA`.`raceId`= `RE`.`raceId`
  GROUP BY `RE`.`raceId`
) AS `R`
LEFT OUTER JOIN `circuits` AS `C`
ON `R`.`circuitId` = `C`.`circuitId`
GROUP BY `C`.`country`;
-- main:query:end
