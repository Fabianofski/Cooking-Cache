import { database, uploadFileToStorage, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollection } from '../../../../../models/RecipeCollections.js';

export async function PATCH({ params, request }) {
	const token = request.headers.get('Authorization');
	const collectionId = params.collectionId;
	if (!token || !collectionId) return new Response('400 Bad Request', { status: 400 });

	try {
		const userId = await verifyIdToken(token);

		try {
			const formData = await request.formData();
			const cover = formData.get('cover') as File;

			if (!cover) return new Response('400 Bad Request', { status: 400 });

			const data = await database.ref(`collections/${collectionId}`).get();
			const collection: RecipeCollection = data.val() || {};

			if (!collection) return new Response('404 Not Found', { status: 404 });
			if (collection.ownerId !== userId) return new Response('403 Forbidden', { status: 403 });

			const photoURL = await uploadFileToStorage(
				cover,
				`collections/${collectionId}/${collectionId}`
			);
			await database.ref(`collections/${collectionId}/cover`).set(photoURL);

			return json(photoURL);
		} catch (error) {
			console.error(error);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return new Response('401 Unauthorized', { status: 401 });
	}
}
