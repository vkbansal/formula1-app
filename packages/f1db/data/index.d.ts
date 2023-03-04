import type { IHomePageData } from '../dist/types/homepage.js';
import type { ISeasonsList } from '../dist/types/seasons-list.js';
import type { IDriverData } from '../dist/types/drivers.js';
import type { IConstructorData } from '../dist/types/constructors.js';
import type { ISeasonData } from '../dist/types/seasons.js';
import type { IRaceData } from '../dist/types/rounds.js';

export const homepage: IHomePageData;
export const seasons_list: ISeasonsList;
export const drivers: Record<string, IDriverData>;
export const constructors: Record<string, IConstructorData>;
export const seasons: Record<string, ISeasonData>;
export const rounds: Record<string, IRaceData>;
