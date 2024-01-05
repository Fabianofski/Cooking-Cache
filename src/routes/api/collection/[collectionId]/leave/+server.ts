import { database, verifyIdToken } from '$lib/firebase.admin';
import type { RecipeCollection } from '../../../../../models/RecipeCollections';

export async function DELETE({ request, params }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);
		try {
			const collectionId = params.collectionId;

			const data = await database.ref(`collections/${collectionId}`).get();
			let val: RecipeCollection = data.val();

			if (!val) return new Response('404 Not Found', { status: 404 });

			await database.ref(`users/${uid}/joinedCollectionsIds/${collectionId}`).remove();
			await database.ref(`collections/${collectionId}/participants/${uid}`).remove();
			return new Response('200 OK', { status: 200 });
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
