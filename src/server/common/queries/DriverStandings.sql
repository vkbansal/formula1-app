SELECT
  R.round     AS round,
  R.name      AS name,
  R.date      AS date,
  CI.name     AS circuit,
  CI.location AS city,
  CI.country  AS country,
  DS.points   AS cumulativePoints,
  DS.position AS position,
  RE.points   AS points,
  S.status    AS status,
  RE.positionOrder AS racePosition
FROM drivers AS D
LEFT OUTER JOIN driverStandings AS DS ON DS.driverId = D.id
LEFT OUTER JOIN races           AS R  ON DS.raceId   = R.id
LEFT OUTER JOIN results         AS RE ON RE.driverId = D.id AND RE.raceId = R.id
LEFT OUTER JOIN circuits        AS CI ON R.circuitId = CI.id
LEFT OUTER JOIN status          AS S  ON RE.statusId = S.id
WHERE D.ref = ? AND R.year = ?
ORDER BY R.round ASC
