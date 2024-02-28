import { auth, bucket, database } from '$lib/server/firebase.admin';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { Recipe } from '../../../../../models/Recipe.js';
import type { RecipeCollection } from '../../../../../models/RecipeCollections.js';
import { uploadFileToStorage } from '$lib/server/firebase.utils.js';


export async function GET({ params, url }) {
    const collectionId = params.collectionId;
    const accessToken = url.searchParams.get('key');
    const recipeId = url.searchParams.get('id');

    if (!collectionId || !recipeId) return new Response('400 Bad Request', { status: 400 });

    try {
        const data = await database.ref(`collections/${collectionId}`).get();
        const collection: RecipeCollection = data.val() || {};
        console.log(collection);
        if (!collection) return new Response('404 Not Found', { status: 404 });

        const recipe = Object.values(collection.recipes || {}).find((x) => x.id === recipeId);
        console.log(recipe);
        if (!recipe) return new Response('404 Not Found', { status: 404 });
        if (recipe.accessToken !== accessToken) return new Response('403 Forbidden', { status: 403 });

        return json(recipe);
    } catch (err) {
        console.error(err);
        return new Response('500 Internal Server Error', { status: 500 });
    }
}

export async function POST({ request, params }) {
	const token = request.headers.get('Authorization');
	const collectionId = params.collectionId;

	try {
		if (token === null) throw new Error('No token provided');
		const { uid } = await auth.verifyIdToken(token);

		try {
			const formData = await request.formData();
			const recipe = JSON.parse(formData.get('recipe') as string) as Recipe;
			if (!recipe || !collectionId) return new Response('400 Bad Request', { status: 400 });

			const data = await database.ref(`collections/${collectionId}`).get();
			const collection: RecipeCollection = data.val() || {};
			if (!collection) return new Response('404 Not Found', { status: 404 });

			if (!collection.participants?.find((p) => p.uid === uid))
				return new Response('403 Forbidden', { status: 403 });

			if (!recipe.id) recipe.id = uuidv4();
			const cover = formData.get('cover') as File;
			if (cover)
				recipe.image = await uploadFileToStorage(
					cover,
					`collections/${collectionId}/recipes/${recipe.id}`
				);

			await database.ref(`collections/${collectionId}/recipes/${recipe.id}`).set(recipe);
			return json(recipe);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}

export async function DELETE({ request, params, url }) {
	const token = request.headers.get('Authorization');
	const collectionId = params.collectionId;
	const recipeId = url.searchParams.get('id');

	if (!collectionId || !token || !recipeId) return new Response('400 Bad Request', { status: 400 });

	try {
		if (token === null) throw new Error('No token provided');
		const { uid } = await auth.verifyIdToken(token);

		try {
			const data = await database.ref(`collections/${collectionId}`).get();
			const collection: RecipeCollection = data.val() || {};
			if (!collection) return new Response('404 Not Found', { status: 404 });

			collection.recipes = Object.values(collection.recipes || {});
			const recipe = collection.recipes.find((x) => x.id === recipeId);
			if (!recipe) return new Response('404 Not Found', { status: 404 });

			if (collection.ownerId !== uid && recipe?.creatorId !== uid)
				return new Response('403 Forbidden', { status: 403 });

			await database.ref(`collections/${collectionId}/recipes/${recipeId}`).remove();

			const reference = bucket.file(`collections/${collectionId}/recipes/${recipe.id}`);
			await reference.delete().catch((err) => {
				if (err.code !== 404) console.error(err);
			});

			return new Response('200 OK', { status: 200 });
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
