import { database } from '$lib/server/firebase.admin';
import type { RecipeCollection } from '../../../models/RecipeCollections.js';

export async function getRecipeWithAccessToken(
	collectionId: string,
	recipeId: string,
	accessToken: string
) {
	const data = await database.ref(`collections/${collectionId}`).get();
	const collection: RecipeCollection = data.val() || {};
	if (!collection) throw new Error('404 Not Found');

	const recipe = Object.values(collection.recipes || {}).find((x) => x.id === recipeId);
	if (!recipe) throw new Error('404 Not Found');
	if (recipe.accessToken !== accessToken) throw new Error('403 Forbidden');

	return recipe;
}
