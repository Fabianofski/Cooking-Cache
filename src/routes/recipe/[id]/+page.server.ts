import { error } from '@sveltejs/kit';
import { recipesStore } from '../../../stores/store.js';
import type { Recipe } from '../../../models/Recipe.js';

let recipes: Recipe[] = [];
recipesStore.subscribe((value) => {
	recipes = value;
});

export function load({ params }) {
	const recipe = recipes.find((recipe) => recipe.id === params.id);

	if (!recipe) throw error(404);

	return {
		recipe
	};
}
