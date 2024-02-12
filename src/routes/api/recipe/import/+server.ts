import { json } from '@sveltejs/kit';
import type { Recipe } from '../../../../models/Recipe.js';
import { extractChefkochRecipe } from '$lib/server/recipeImport/chefkoch.import.js';

export async function GET({ url }) {
	const importURL = url.searchParams.get('url');

	if (!importURL) return new Response('400 Bad Request', { status: 400 });

	const recipe: Recipe = await extractChefkochRecipe(importURL);

	return json(recipe);
}
