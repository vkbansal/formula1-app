-- path: drivers/:driverRef.json
-- meta: {pickFirst: true}
-- params:query:start
SELECT `driverRef` FROM `drivers`;
-- params:query:end

-- main:query:start
SELECT
   `D`.`driverRef`,
  CONCAT(`forename`, " ", `surname`) AS `name`,
   `D`.`dob`,
   `D`.`nationality`
FROM `drivers` AS `D`
WHERE `D`.`driverRef` = :driverRef
-- main:query:end
