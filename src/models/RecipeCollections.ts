import type { Recipe } from './Recipe';

export interface RecipeCollections {
	[key: string]: Recipe[];
}
