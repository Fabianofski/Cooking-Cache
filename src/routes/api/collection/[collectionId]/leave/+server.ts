import { auth, database } from '$lib/server/firebase.admin';
import type { RecipeCollection } from '../../../../../models/RecipeCollections';

export async function DELETE({ request, params }) {
	const token = request.headers.get('Authorization');

	try {
		if (token === null) throw new Error('No token provided');
		const { uid } = await auth.verifyIdToken(token);

		try {
			const collectionId = params.collectionId;

			const data = await database.ref(`collections/${collectionId}`).get();
			let collection: RecipeCollection = data.val();

			if (!collection) return new Response('404 Not Found', { status: 404 });

			let participants = collection.participants ?? [];
			participants = participants.filter((p) => p.uid !== uid);

			await database.ref(`users/${uid}/joinedCollectionsIds/${collectionId}`).remove();
			await database.ref(`collections/${collectionId}/participants`).set(participants);
			return new Response('200 OK', { status: 200 });
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
