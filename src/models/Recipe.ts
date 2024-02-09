import type Ingredient from './Ingredient';

export interface Recipe {
	image: string;

	title: string;
	url: string;

	tags?: string[];
	createdTime: string;
	updatedTime: string;
	numberOfServings?: number;
	cookingTime?: number;
	difficulty: 'easy' | 'medium' | 'hard';

	ingredients: { [key: string]: Ingredient[] };
	description: string[];

	id: string;
	collectionId: string;
	creatorId: string;
}

export let difficultyLabels: {
	[key: string]: string;
} = {
	easy: 'Leicht',
	medium: 'Mittel',
	hard: 'Schwer'
};
