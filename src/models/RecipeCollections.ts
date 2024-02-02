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
	displayName: string | undefined | null;
	uid: string;
	email: string | undefined | null;
	photoURL: string | undefined | null;
}
