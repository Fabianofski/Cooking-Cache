import { auth, database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollection } from '../../../../../models/RecipeCollections.js';

export async function GET({ url, params }) {
	let inviteCode = url.searchParams.get('i');
	let collectionId = params.collectionId;

	if (!inviteCode || !collectionId) return new Response('400 Bad Request', { status: 400 });

	const data = await database.ref(`collections/${collectionId}`).get();
	let collection: RecipeCollection = data.val();
	collection.recipes = Object.values(collection.recipes || {});

	if (!collection) return new Response('404 Not Found', { status: 404 });
	if (collection.inviteCode !== inviteCode) return new Response('403 Forbidden', { status: 403 });

	return json(collection);
}

export async function POST({ url, params, request }) {
	let inviteCode = url.searchParams.get('i');
	let collectionId = params.collectionId;

	const token = request.headers.get('Authorization');

	try {
		const userId = await verifyIdToken(token);

		if (!inviteCode || !collectionId) return new Response('400 Bad Request', { status: 400 });

		try {
			const data = await database.ref(`collections/${collectionId}`).get();
			let collection: RecipeCollection = data.val();
			collection.recipes = Object.values(collection.recipes || {});

			if (!collection) return new Response('404 Not Found', { status: 404 });
			if (collection.inviteCode !== inviteCode)
				return new Response('403 Forbidden', { status: 403 });

			const participants = collection.participants || [];
			if (participants.find((p) => p.uid === userId)) return json(collection);

			const user = await auth.getUser(userId);
			participants.push({
				displayName: user.displayName,
				uid: user.uid,
				email: user.email,
				photoURL: user.photoURL
			});

			await database.ref(`collections/${collectionId}/participants`).set(participants);
			await database.ref(`users/${userId}/joinedCollectionsIds/${collectionId}`).set(true);
			collection.participants = participants;

			return json(collection);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
