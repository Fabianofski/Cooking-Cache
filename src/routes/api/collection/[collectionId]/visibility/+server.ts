import { database, verifyIdToken } from '$lib/firebase.admin';
import type { RecipeCollection } from '../../../../../models/RecipeCollections.js';

export async function PATCH({ params, request, url }) {
	const token = request.headers.get('Authorization');
	const collectionId = params.collectionId;
	const visibility: boolean | undefined = Boolean(url.searchParams.get('private'));

	if (!token || !collectionId || visibility === undefined)
		return new Response('400 Bad Request', { status: 400 });

	try {
		const userId = await verifyIdToken(token);

		try {
			const data = await database.ref(`collections/${collectionId}`).get();
			const collection: RecipeCollection = data.val() || {};

			if (!collection) return new Response('404 Not Found', { status: 404 });
			if (collection.ownerId !== userId) return new Response('403 Forbidden', { status: 403 });

			await database.ref(`collections/${collectionId}/private`).set(visibility);

			return new Response('200 OK', { status: 200 });
		} catch (error) {
			console.error(error);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return new Response('401 Unauthorized', { status: 401 });
	}
}
