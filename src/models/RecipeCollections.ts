import type { Recipe } from './Recipe';

export interface RecipeCollections {
	[key: string]: RecipeCollection;
}

export interface RecipeCollection {
	participants?: Participant[];
	ownerId: string;
	name: string;
	id: string;
	inviteCode: string;
	private: boolean;
	cover: string | undefined;

	recipes: Recipe[];
}

export interface Participant {
	displayName: string | undefined;
	uid: string;
	email: string | undefined;
	photoURL: string | undefined;
}
