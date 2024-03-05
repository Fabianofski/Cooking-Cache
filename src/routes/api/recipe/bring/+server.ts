import { database } from '$lib/server/firebase.admin';
import type { Recipe } from '../../../../models/Recipe';
import type { RecipeCollection } from '../../../../models/RecipeCollections';

function convertIngredientsToArray(recipe: Recipe) {
	const ingredients = [];
	for (const category in recipe.ingredients) {
		for (const ingredient of recipe.ingredients[category]) {
			ingredients.push(`${ingredient.amount}${ingredient.unit || ''} ${ingredient.name}`);
		}
	}
	return ingredients;
}

export async function GET({ url }) {
	const collectionId = url.searchParams.get('collectionId');
	const recipeId = url.searchParams.get('recipeId');
	const accessToken = url.searchParams.get('key');

	if (!collectionId || !recipeId || !accessToken)
		return new Response('400 Bad Request', { status: 400 });

	try {
		const data = await database.ref(`collections/${collectionId}`).get();
		const collection: RecipeCollection = data.val() || {};
		if (!collection) return new Response('404 Not Found', { status: 404 });

		const recipe = Object.values(collection.recipes || {}).find((x) => x.id === recipeId);
		if (!recipe) return new Response('404 Not Found', { status: 404 });
		if (recipe.accessToken !== accessToken) return new Response('403 Forbidden', { status: 403 });

		const jsonLD = {
			'@context': 'https://schema.org',
			'@type': 'Recipe',
			author: 'Cooking Cache',
			totalTime: `PT${recipe.cookingTime}M`,
			datePublished: recipe.createdTime.split('T')[0],
			image: recipe.image,
			recipeIngredient: convertIngredientsToArray(recipe),
			name: recipe.title,
			recipeInstructions: recipe.description.join('\n'),
			recipeYield: recipe.numberOfServings
		};
		let htmlResponse = `<!DOCTYPE html><html><head><script type="application/ld+json">${JSON.stringify(
			jsonLD
		)}<\/script><\/head>`;
		htmlResponse += '<body><div>Success</div></body></html>';

		return new Response(htmlResponse, {
			status: 200,
			headers: {
				'Content-Type': 'text/html'
			}
		});
	} catch (err) {
		console.error(err);
		return new Response('500 Internal Server Error', { status: 500 });
	}
}
