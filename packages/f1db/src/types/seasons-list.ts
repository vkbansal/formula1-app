import { z } from 'zod';

import { Season } from './db.js';

export const SeasonsList = z.array(Season.pick({ year: true }));

export type ISeasonsList = z.infer<typeof SeasonsList>;
