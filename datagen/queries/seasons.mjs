export async function query(db) {
  const data = await db
    .collection('seasons')
    .find({})
    .sort('year', 1)
    .toArray();

  return {
    data: data.map((row) => row.year),
    path: 'seasons/index.yaml'
  };
}
