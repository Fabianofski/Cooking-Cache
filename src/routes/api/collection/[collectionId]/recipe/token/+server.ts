import { auth, database } from '$lib/server/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollection } from '../../../../../../models/RecipeCollections.js';
import { generateRandomInviteCode } from '../../../collection.handler.js';

export async function GET({ url, request, params }) {
	const token = request.headers.get('Authorization');
	const collectionId = params.collectionId;
	const recipeId = url.searchParams.get('id');

	if (!collectionId || !recipeId) return new Response('400 Bad Request', { status: 400 });

	try {
		if (token === null) throw new Error('No token provided');
		const { uid } = await auth.verifyIdToken(token);
		try {
			const data = await database.ref(`collections/${collectionId}`).get();
			const collection: RecipeCollection = data.val() || {};
			if (!collection) return new Response('404 Not Found', { status: 404 });

			if (!collection.participants?.find((x) => x.uid === uid))
				return new Response('403 Forbidden', { status: 403 });

			const recipe = Object.values(collection.recipes || {}).find((x) => x.id === recipeId);
			if (!recipe) return new Response('404 Not Found', { status: 404 });

			const token = generateRandomInviteCode();
			await database.ref(`collections/${collectionId}/recipes/${recipeId}/accessToken`).set(token);

			return json(token);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch (err) {
		return new Response('403 Forbidden', { status: 403 });
	}
}
