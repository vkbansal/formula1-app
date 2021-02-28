SELECT
  json_object(
    'id', D.id,
    'ref', D.ref,
    'forename', D.forename,
    'surname', D.surname,
    'nationality', T.iso,
    'code', D.code,
    'dob', D.dob,
    'url', D.url
  ) as driver,
  DS.position AS position,
  DS.points AS points
FROM driverStandings AS DS
LEFT OUTER JOIN races AS R ON DS.raceId = R.id
LEFT OUTER JOIN drivers AS D ON DS.driverId = D.id
LEFT OUTER JOIN countries AS T ON T.id = D.countryId
WHERE R.year = ? AND R.round = (SELECT MAX(round) from races WHERE year = ? LIMIT 1)
GROUP BY D.id
ORDER BY DS.position ASC
