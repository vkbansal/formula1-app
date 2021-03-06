SELECT
    C.id   AS id,
    C.ref  AS ref,
    C.name AS name,
    T.iso  AS nationality,
    C.url  AS url
FROM constructors AS C
LEFT OUTER JOIN countries AS T ON T.id = C.countryId
WHERE C.ref = ?
