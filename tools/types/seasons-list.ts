import { z } from 'zod';

import { Season } from './db.js';

export const SeasonsList = z.array(
	Season.pick({ year: true }).extend({ totalRaces: z.number() }),
);

export type ISeasonsList = z.infer<typeof SeasonsList>;
