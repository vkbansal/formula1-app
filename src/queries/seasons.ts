import { query } from 'utils/db';

const seasons = (): Promise<number[]> =>
  query('seasons-desc', async (db) => {
    const collection = db.collection('seasons');
    const data = await collection.find().sort({ year: 'desc' }).toArray();

    return data.map((row) => row.year);
  });

export default seasons;
