import { database, verifyIdToken, uploadFileToStorage } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { Recipe } from '../../../models/Recipe.js';

export async function POST({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		const formData = await request.formData();
		const recipe = JSON.parse(formData.get('recipe') as string) as Recipe;
		const cover = formData.get('cover') as File;
		recipe.id = uuidv4();

		if (cover)
			recipe.image = await uploadFileToStorage(
				cover,
				`collections/${recipe.collectionId}/${recipe.id}.${cover.name.split('.').pop()}`
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
