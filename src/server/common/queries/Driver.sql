SELECT
  D.id AS id,
  D.ref AS ref,
  D.forename AS forename,
  D.surname AS surname,
  T.iso AS nationality,
  D.code AS code,
  D.dob AS dob,
  D.url AS url
FROM drivers AS D
LEFT OUTER JOIN countries AS T ON T.id = D.countryId
WHERE D.ref = ?
