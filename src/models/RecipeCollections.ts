import type { Recipe } from './Recipe';

export interface RecipeCollections {
	[key: string]: RecipeCollection;
}

export interface RecipeCollection {
	participants: { name: string; email: string; profile: string }[];
	ownerId: string;
	recipes: Recipe[];
}
