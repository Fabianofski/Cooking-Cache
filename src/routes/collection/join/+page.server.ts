import type { RecipeCollection } from '../../../models/RecipeCollections.js';
import { getRecipeCollectionByInviteCode } from '../../api/collection/collection.handler.js';

export const prerender = false;

export async function load({ url }) {
	const inviteCode = url.searchParams.get('i');
	try {
		let recipeCollection: RecipeCollection | undefined = undefined;
		if (inviteCode) recipeCollection = await getRecipeCollectionByInviteCode(inviteCode);

		return {
			recipeCollection,
			inviteCode
		};
	} catch (e: any) {
		console.error(e);
		return {
			recipeCollection: null,
			inviteCode
		};
	}
}
