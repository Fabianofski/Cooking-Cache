import { auth, database } from '$lib/server/firebase.admin';
import type { RecipeCollection } from '../../../../../models/RecipeCollections';

export async function PATCH({ request, url, params }) {
	const token = request.headers.get('Authorization');

	try {
		if (token === null) throw new Error('No token provided');
		const { uid } = await auth.verifyIdToken(token);

		try {
			const newCollectionName = url.searchParams.get('newCollectionName');
			const collectionId = params.collectionId;

			if (!newCollectionName || !collectionId)
				return new Response('400 Bad Request', { status: 400 });

			const data = await database.ref(`collections/${collectionId}`).get();
			let val: RecipeCollection = data.val();

			if (!val) return new Response('404 Not Found', { status: 404 });
			if (val.ownerId !== uid) return new Response('403 Forbidden', { status: 403 });
			val.name = newCollectionName;

			await database.ref(`collections/${collectionId}`).set(val);

			return new Response('200 OK', { status: 200 });
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
