import { query } from 'utils/db';
import { type Season } from 'utils/types';

const seasons = (): Promise<number[]> =>
  query('seasons-desc', async (db) => {
    const collection = db.collection<Season>('seasons');
    const data = await collection.find().sort({ year: 'desc' }).toArray();

    return data.map((row) => row.year);
  });

export default seasons;
