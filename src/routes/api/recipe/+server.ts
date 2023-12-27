import { database, verifyIdToken, uploadFileToStorage } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { Recipe } from '../../../models/Recipe.js';
import type { RecipeCollection } from '../../../models/RecipeCollections.js';

export async function POST({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		const formData = await request.formData();
		const recipe = JSON.parse(formData.get('recipe') as string) as Recipe;
		if (!recipe) return new Response('400 Bad Request', { status: 400 });

		const data = await database.ref(`collections/${recipe.collectionId}`).get();
		const collection: RecipeCollection = data.val() || {};
		if (!collection) return new Response('404 Not Found', { status: 404 });

		const participants = collection.participants || [];
		if (!participants.find((p) => p.uid === uid))
			return new Response('403 Forbidden', { status: 403 });

		recipe.id = uuidv4();
		const cover = formData.get('cover') as File;
		if (cover)
			recipe.image = await uploadFileToStorage(
				cover,
				`collections/${recipe.collectionId}/recipes/${recipe.id}.${cover.name.split('.').pop()}`
			);

		try {
			await database.ref(`collections/${recipe.collectionId}/recipes/${recipe.id}`).set(recipe);
			return json(recipe);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
