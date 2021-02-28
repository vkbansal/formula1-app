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
    WHERE D.id = Q.driverId
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
    WHERE D.id = W.driverId
  ) AS winner
FROM races AS R
LEFT OUTER JOIN qualifying AS Q on Q.raceId = R.id
LEFT OUTER JOIN results AS W on W.raceId = R.id
WHERE R.year = ? AND Q.position = 1 AND W.position = 1
ORDER BY R.round ASC
