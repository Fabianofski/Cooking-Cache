import { auth, database } from '$lib/server/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollection } from '../../../../../models/RecipeCollections.js';
import { uploadFileToStorage } from '$lib/server/firebase.utils.js';
import { defaultCovers } from '$lib/defaultCollectionCovers.js';

export async function PATCH({ params, request, url }) {
	const token = request.headers.get('Authorization');
	const collectionId = params.collectionId;
	const coverUrl = url.searchParams.get('coverUrl');
	if (!token || !collectionId) return new Response('400 Bad Request', { status: 400 });

	try {
		if (token === null) throw new Error('No token provided');
		const { uid } = await auth.verifyIdToken(token);

		try {
			const formData = await request.formData();
			const cover = formData.get('cover') as File;

			if (!cover && !coverUrl) return new Response('400 Bad Request', { status: 400 });
			if (coverUrl && !defaultCovers.includes(coverUrl))
				return new Response('400 Bad Request', { status: 400 });

			const data = await database.ref(`collections/${collectionId}`).get();
			const collection: RecipeCollection = data.val() || {};

			if (!collection) return new Response('404 Not Found', { status: 404 });
			if (collection.ownerId !== uid) return new Response('403 Forbidden', { status: 403 });

			let photoURL = '';
			if (cover)
				photoURL = await uploadFileToStorage(cover, `collections/${collectionId}/${collectionId}`);
			else if (coverUrl) photoURL = coverUrl;
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
