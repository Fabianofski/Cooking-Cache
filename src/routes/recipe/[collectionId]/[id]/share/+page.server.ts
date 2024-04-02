import { getRecipeWithAccessToken } from '../../../../api/recipe/recipe.handler';

export const prerender = false;

export async function load({ params, url }) {
	const recipe = await getRecipeWithAccessToken(
		params.collectionId,
		params.id,
		url.searchParams.get('key')
	);
	return {
		recipe
	};
}
