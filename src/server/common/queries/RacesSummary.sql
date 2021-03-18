SELECT
  R.round AS round,
  R.date AS date,
  R.name AS name,
  (
    SELECT JSON_OBJECT(
      'id', D.id,
      'ref', D.ref,
      'forename', D.forename,
      'surname', D.surname,
      'nationality', T.iso,
      'code', D.code,
      'dob', D.dob,
      'url', D.url
    ) FROM drivers AS D
    LEFT OUTER JOIN countries AS T on D.countryId = T.id
    WHERE D.id = (SELECT driverId FROM qualifying AS Q WHERE Q.raceId = R.id AND Q.position = 1 LIMIT 1)
  ) AS polePosition,
  (
    SELECT JSON_OBJECT(
      'id', D.id,
      'ref', D.ref,
      'forename', D.forename,
      'surname', D.surname,
      'nationality', T.iso,
      'code', D.code,
      'dob', D.dob,
      'url', D.url
    ) FROM drivers AS D
    LEFT OUTER JOIN countries AS T on D.countryId = T.id
    WHERE D.id = (SELECT driverId FROM results AS W WHERE W.raceId = R.id AND W.position = 1 LIMIT 1)
  ) AS winner
FROM races AS R
WHERE R.year = ?
ORDER BY R.round ASC
