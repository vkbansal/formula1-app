SELECT
  R.round     AS round,
  R.name      AS name,
  R.date      AS date,
  CI.name     AS circuit,
  CI.location AS city,
  CI.country  AS country,
  CS.points   AS cumulativePoints,
  CS.position AS position,
  CR.points   AS  points
FROM constructors AS C
LEFT OUTER JOIN constructorStandings AS CS ON CS.constructorId = C.id
LEFT OUTER JOIN races                AS R  ON CS.raceId        = R.id
LEFT OUTER JOIN constructorResults   AS CR ON CR.constructorId = C.id AND CR.raceId = R.id
LEFT OUTER JOIN circuits             AS CI ON R.circuitId       = CI.id
WHERE C.ref = ? AND R.year = ?
ORDER BY R.round ASC
