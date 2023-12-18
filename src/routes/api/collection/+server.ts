import { database, verifyIdToken } from '$lib/firebase.admin';
import type { RecipeCollection } from '../../../models/RecipeCollections';

export async function POST({ request, url }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);
		const collectionName = url.searchParams.get('collectionName');
		if (!collectionName) return new Response('400 Bad Request', { status: 400 });
		let illegalCharacters = ['.', '#', '$', '[', ']'];
		for (let char in illegalCharacters) {
			if (collectionName.includes(char)) {
				return new Response(
					'400 Bad Request. ' + illegalCharacters.join(' ,' + ' are not allowed.'),
					{ status: 400 }
				);
			}
		}

		try {
			const ref = database.ref(`users/${uid}/collections/${collectionName}`);
			const defaultCollection: RecipeCollection = {
				participants: [],
				ownerId: uid,
				recipes: []
			};
			await ref.set(defaultCollection);
			return new Response('200 Ok', { status: 200 });
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
