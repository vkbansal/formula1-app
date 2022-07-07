-- path: seasons/:year/races/:num-:name.json
-- meta: {pickFirst: true}
-- params:query:start
SELECT
  LPAD(CAST(`R`.`round` AS CHAR), 2, "0") AS `num`,
  `R`.`round` AS `round`,
  `R`.`year` AS `year`,
  `R`.`name` AS `name`
FROM `races` AS `R`
-- params:query:end

-- main:query:start
SELECT
  `T2`.`raceId`,
  `T2`.`year`,
  `T2`.`round`,
  `T2`.`name`,
  `T2`.`date`,
  `T2`.`time`,
  `T2`.`circuit`,
  `D`.`driverRef` AS `winnerDriver`,
  `C`.`constructorRef` AS `winnerConstructor`,
  `T2`.`driverStandings`,
  `T2`.`constructorStandings`
FROM (
  SELECT
    `T1`.`raceId`,
    `T1`.`year`,
    `T1`.`round`,
    `T1`.`name`,
    `T1`.`date`,
    `T1`.`time`,
    (
      SELECT
        JSON_OBJECT(
          'name', `C`.`name`,
          'location', `C`.`location`,
          'country', `C`.`country`
      )
      FROM `circuits` AS `C`
      WHERE `C`.`circuitId` = `T1`.`circuitId`
      LIMIT 1
    ) AS `circuit`,
    `T1`.`driverStandings`,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'constructorRef', `C`.`constructorRef`,
        'position', `CS`.`position`,
        'points', `CS`.`points`,
        'wins', `CS`.`wins`
      ) ORDER BY `CS`.`position` ASC
    ) AS `constructorStandings`
  FROM (
      SELECT
        `R`.`raceId`,
        `R`.`year`,
        `R`.`round`,
        `R`.`name`,
        `R`.`date`,
        `R`.`time`,
        `R`.`circuitId`,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'driverRef', `D`.`driverRef`,
            'position', `DS`.`position`,
            'points', `DS`.`points`,
            'wins', `DS`.`wins`
          ) ORDER BY `DS`.`position` ASC
        ) AS `driverStandings`
      FROM `races` AS `R`
    LEFT OUTER JOIN `driverStandings` AS `DS` USING (`raceId`)
    LEFT OUTER JOIN `drivers` AS `D` USING (`driverId`)
    WHERE
      `R`.`year` = :year AND
      `R`.`round` = :round
    GROUP BY `R`.`raceId`
  ) AS `T1`
  LEFT OUTER JOIN `constructorStandings` AS `CS` USING (`raceId`)
  LEFT OUTER JOIN `constructors` AS `C` USING (`constructorId`)
  GROUP BY `T1`.`raceId`
) AS `T2`
LEFT OUTER JOIN `results` AS `R`
ON
  `R`.`raceId` = `T2`.`raceId` AND
  `R`.`position` = 1
LEFT OUTER JOIN `drivers` AS `D` USING (`driverId`)
LEFT OUTER JOIN `constructors` AS `C` USING (`constructorId`)

-- main:query:end
