import { auth, database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollection, RecipeCollections } from '../../../../models/RecipeCollections.js';

export async function GET({ url }) {
	let inviteCode = url.searchParams.get('i');

	if (!inviteCode) return new Response('400 Bad Request', { status: 400 });

	const data = await database
		.ref(`collections`)
		.orderByChild('inviteCode')
		.equalTo(inviteCode)
		.get();
	let snapshot = (data.val() || {}) as RecipeCollections;
	let collection: RecipeCollection | undefined = Object.values(snapshot).at(0);
	if (!collection) return new Response('404 Not Found', { status: 404 });

	if (collection.private) return new Response('403 Forbidden', { status: 403 });

	collection.recipes = Object.values(collection.recipes || {});

	return json(collection);
}

export async function POST({ url, request }) {
	let inviteCode = url.searchParams.get('i');

	const token = request.headers.get('Authorization');

	try {
		const userId = await verifyIdToken(token);

		if (!inviteCode) return new Response('400 Bad Request', { status: 400 });

		try {
			const data = await database
				.ref(`collections`)
				.orderByChild('inviteCode')
				.equalTo(inviteCode)
				.get();
			let snapshot = (data.val() || {}) as RecipeCollections;
			let collection: RecipeCollection | undefined = Object.values(snapshot).at(0);
			if (!collection) return new Response('404 Not Found', { status: 404 });
			if (collection.private) return new Response('403 Forbidden', { status: 403 });

			collection.recipes = Object.values(collection.recipes || {});

			await database.ref(`users/${userId}/joinedCollectionsIds/${collection.id}`).set(true);

			const participants = collection.participants ?? [];
			if (participants.find((p) => p.uid === userId)) return json(collection);

			const user = await auth.getUser(userId);
			participants.push({
				displayName: user.displayName,
				uid: user.uid,
				email: user.email,
				photoURL: user.photoURL
			});

			await database.ref(`collections/${collection.id}/participants`).set(participants);
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
