import type Ingredient from './Ingredient';

export interface Recipe {
	image: string;
	title: string;
	tagline: string;
	tags?: string[];

	ingredients: Ingredient[];
	description: string[];

	id: string;
	collection: string;
	url: string;
}
