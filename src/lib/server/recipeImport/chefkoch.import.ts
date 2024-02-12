import type { Recipe } from '../../../models/Recipe';

export function extractChefkochRecipe(url: string): Recipe {
	return {
		image: '',
		title: '',
		url: url,
		createdTime: '',
		updatedTime: '',
		difficulty: 'easy',
		ingredients: {},
		description: [],
		id: '',
		collectionId: '',
		creatorId: ''
	};
}
