import { database, verifyIdToken } from '$lib/server/firebase.admin';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { RecipeCollection, RecipeCollections } from '../../../models/RecipeCollections';
import { addCollectionToDatabase, getDefaultCollection } from './collection.handler';

async function getJoinedCollections(uid: string): Promise<RecipeCollections> {
	let collections: RecipeCollections = {};

	const joinedData = await database.ref(`users/${uid}/joinedCollectionsIds`).get();
	const joinedCollectionsIds = Object.keys(joinedData.val() || {});
	for (let id of joinedCollectionsIds) {
		const joinedCollectionData = await database.ref(`collections/${id}`).get();
		const joinedCollection: RecipeCollection = joinedCollectionData.val() || {};
		if (Object.values(joinedCollection.participants || {}).find((p) => p.uid === uid))
			collections = { ...collections, [id]: joinedCollection };
	}

	return collections;
}

export async function GET({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		try {
			const data = await database.ref(`collections`).orderByChild('ownerId').equalTo(uid).get();
			let collections: RecipeCollections = data.val() || {};
			let joinedCollections: RecipeCollections = await getJoinedCollections(uid);
			collections = { ...collections, ...joinedCollections };

			Object.keys(collections).forEach((collection: string) => {
				collections[collection].recipes = Object.values(collections[collection].recipes || {});
				collections[collection].participants = Object.values(
					collections[collection].participants ?? {}
				);
			});

			if (Object.values(collections).length < 1) {
				const collectionId = uuidv4();
				await addCollectionToDatabase('Hauptsammlung', uid, collectionId);
				collections[collectionId] = await getDefaultCollection(uid, 'Hauptsammlung', collectionId);
			}

			return json(collections);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}

export async function POST({ request, url }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);
		try {
			const collectionName = url.searchParams.get('collectionName');

			if (!collectionName) return new Response('400 Bad Request', { status: 400 });

			return addCollectionToDatabase(collectionName, uid);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}

export async function DELETE({ request, url }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);
		try {
			const collectionId = url.searchParams.get('collectionId');

			const data = await database.ref(`collections/${collectionId}`).get();
			let val: RecipeCollection = data.val();

			if (!val) return new Response('404 Not Found', { status: 404 });
			if (val.ownerId !== uid) return new Response('403 Forbidden', { status: 403 });

			await database.ref(`collections/${collectionId}`).remove();
			return new Response('200 OK', { status: 200 });
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
