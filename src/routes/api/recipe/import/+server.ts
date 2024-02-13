import { json } from '@sveltejs/kit';
import type { Recipe } from '../../../../models/Recipe.js';
import { extractChefkochRecipe } from '$lib/server/recipeImport/chefkoch.import.js';
import { extractInstagramRecipe } from '$lib/server/recipeImport/instagram.import.js';

export async function GET({ url }) {
	const importURL = url.searchParams.get('url');

	if (!importURL) return new Response('400 Bad Request', { status: 400 });

	let recipe: Recipe;
	if (importURL.includes('chefkoch.de')) recipe = await extractChefkochRecipe(importURL);
	else if (importURL.includes('instagram.com')) recipe = await extractInstagramRecipe(importURL);
	else return new Response('400 Bad Request', { status: 400 });

	return json(recipe);
}
