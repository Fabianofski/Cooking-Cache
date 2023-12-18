import type { Recipe } from './Recipe';

export interface RecipeCollections {
	[key: string]: RecipeCollection;
}

export interface RecipeCollection {
	participants?: { displayName: string; email: string; photoURL: string }[];
	ownerId: string;
	recipes: Recipe[];
}
