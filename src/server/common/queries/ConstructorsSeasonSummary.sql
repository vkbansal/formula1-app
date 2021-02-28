SELECT
  json_object(
    'id', C.id,
    'ref', C.ref,
    'name', C.name,
    'nationality', T.iso,
    'url', C.url
  ) as constructor,
  CS.position AS position,
  CS.points AS points
FROM constructorStandings AS CS
LEFT OUTER JOIN races AS R ON CS.raceId = R.id
LEFT OUTER JOIN constructors AS C ON CS.constructorId = C.id
LEFT OUTER JOIN countries AS T ON T.id = C.countryId
WHERE R.year = ? AND R.round = (SELECT MAX(round) from races WHERE year = ? LIMIT 1)
GROUP BY CS.constructorId
ORDER BY CS.position ASC
